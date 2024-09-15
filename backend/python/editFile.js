const { spawn } = require('child_process');
const path = require('path');

const editFile = (data) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [path.join(__dirname, 'write_training.py'), JSON.stringify(data)]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        resolve();
      }
    });

    pythonProcess.on('error', (err) => {
      console.error(`Failed to start Python process: ${err}`);
      reject(err);
    });
  });
};

module.exports = { editFile };
