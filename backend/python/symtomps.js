// symtomps.js

const { PythonShell } = require('python-shell');
const path = require('path');

const runPy = () => {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json', // Adjust mode to 'json' to handle JSON output
      pythonPath: 'C:/Program Files/Python39/python.exe', // Adjust to your Python installation path
      pythonOptions: ['-u'],
      scriptPath: __dirname,
    };
    // Create a new PythonShell instance
    let pyshell = new PythonShell('get_symtomps.py', options);

    let outputData = ''; // Variable to store Python script output

    // Handle Python script output (stdout)
    pyshell.on('message', (message) => {
      console.log('Python script output:', message);
      outputData += message; // Accumulate output messages
    });

    // Handle Python script exit event
    pyshell.on('close', (code) => {
      console.log(`Python script ended with exit code: ${code}`);
      resolve(outputData); // Resolve the promise with accumulated output
    });

    // Handle Python script error event
    pyshell.on('error', (err) => {
      console.error('PythonShell error:', err);
      reject(err); // Reject the promise with error
    });
  });
};

module.exports = { runPy };
