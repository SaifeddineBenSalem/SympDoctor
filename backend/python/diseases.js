const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const router = express.Router();
const { runPy } = require('../python/symtomps'); // Adjust path if necessary
const { executePythonScript2 } = require('../python/pythonExecutor2'); // Adjust path if necessary
const { executePythonScript } = require('../python/pythonExecutor'); // Import executePythonScript from pythonExecutor module
const Disease = require('../models/disease');
const User = require('../models/user');
const { getPendingDiseases } = require('../python/getPendingDiseases'); // Adjust the path as needed
router.post('/getpendingdiseases', async (req, res) => {
  const result = await getPendingDiseases();

});
router.post('/adddisease', async (req, res) => {
  const { diseasename1, symptoms } = req.body;
  try {
    const output = await runPy();
    let symptomsList = output.split(",");
    const symptomsObject = {};

    symptomsList.forEach(symptom => {
      symptomsObject[symptom] = 0;
    });

    symptoms.forEach(symptom => {
      if (!symptomsObject.hasOwnProperty(symptom)) {
        symptomsObject[symptom] = 0;
        symptomsList.push(symptom);
      }
    });

    symptoms.forEach(symptom => {
      if (symptomsObject.hasOwnProperty(symptom)) {
        symptomsObject[symptom] = 1;
      }
    });
    console.log("Disease Name:", diseasename1);
    const dataToWrite = { diseaseName: diseasename1, symptoms: symptomsObject, allSymptoms: symptomsList };
    executePythonScript2(dataToWrite)
    .then((result) => {
      console.log('Predicted Disease: aaa');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post('/finddiseasebyname', async (req, res) => {
    const { diseasename } = req.body; // Extract diseasename from the request body
    try {
      const result = await getDiseases(); // Fetch diseases
      const diseasesArray = result.split(","); // Split the result into an array
      if (diseasesArray.includes(diseasename)) {
        res.status(200).json({ message: "Disease found", exists: true });
      } else {
        res.status(404).json({ message: "Disease not found", exists: false });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
router.get('/getsymptoms', async (req, res) => {
    try {
        const output = await runPy();
        res.json(output); // Send the Python script output as JSON response
    } catch (error) {
        console.error('Error in getsymptoms route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getdiseasesbyuser', async (req, res) => {
    const userId = req.body.userId;
    const diseases = await Disease.getDiseasesByUser(userId);
    console.log(diseases);
    
    res.json(diseases);
});
router.post('/finddiseases', async (req, res) => {
    try {
        // Get the list of symptoms from the Python script
        let symptomsListJson = await runPy();

       // let symptomsList = JSON.parse(symptomsListJson); // Ensure parsing JSON string
       let symptomsList = symptomsListJson.split(",");
       let userId = req.body.symptoms[req.body.symptoms.length - 1];
       let userIdInt = parseInt(userId, 10);
       let currentUser = User.findUserById(userIdInt);
       req.body.symptoms.pop();
       console.log(userIdInt);
        const selectedSymptoms = req.body.symptoms;
        const symptomsObject = {};
        // Initialize all symptoms to 0
        symptomsList.forEach(symptom => {
            symptomsObject[symptom] = 0;
        });

        // Set selected symptoms to 1
        selectedSymptoms.forEach(symptom => {
            if (symptomsObject.hasOwnProperty(symptom)) {
                symptomsObject[symptom] = 1;
            }
        });
        // Execute the Python script with the formatted symptoms object
        let result = await executePythonScript(symptomsObject);
        console.log(result);
        executePythonScript(symptomsObject)
        .then((result) => {
          console.log('Predicted Disease: aaa', result);
          const timestampMs = Date.now();
          const dateString1 = new Date(timestampMs).toLocaleString();
          Disease.create(userIdInt,result,dateString1,currentUser.country);
          res.json(result);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
        console.log(symptomsList.length);

    } catch (error) {
        console.error('Error in finddiseases route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
