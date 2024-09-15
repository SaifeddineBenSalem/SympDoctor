// backend/pythonExecutor.js

const { spawn } = require('child_process');
const path = require('path');

const executePythonScript = (symptomsObject) => {
  return new Promise((resolve, reject) => {
    // Python script file path
    const pythonScriptPath = path.join(__dirname, 'predict.py');

    // Arguments to be passed to the Python script
    const args = [JSON.stringify(symptomsObject)];

    // Spawn the Python process
    const pythonProcess = spawn('python', [pythonScriptPath, ...args]);

    let outputData = ''; // Variable to store Python script output

    // Handle stdout data from Python script
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Received message from Python script: ${data}`); // Debugging
      outputData += data.toString(); // Accumulate output messages
    });

    // Handle stderr data from Python script (if any)
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python script: ${data}`); // Debugging
      reject(`Error from Python script: ${data}`); // Reject with error message
    });

    // Handle Python script exit event
    pythonProcess.on('exit', (code) => {
      console.log(`Python script ended with exit code: ${code}`); // Debugging
      if (code === 0) {
        resolve(outputData.trim()); // Resolve the promise with trimmed output
      } else {
        reject(`Python script process exited with code ${code}`);
      }
    });
    
    // Handle Python process error event
    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python process:', err); // Debugging
      reject(err); // Reject with error
    });
  });
};

module.exports = { executePythonScript };
