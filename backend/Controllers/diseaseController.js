const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const secretKey = 'abcdefgh123AZERTY'; // Replace with a long, random string for security
const jwt = require('jsonwebtoken');

const { runPy } = require('../python/symtomps'); // Adjust path if necessary
const { executePythonScript3 } = require('../python/pythonExecutor3'); // Adjust path if necessary

const { executePythonScript2 } = require('../python/pythonExecutor2'); // Adjust path if necessary
const { executePythonScript } = require('../python/pythonExecutor'); // Import executePythonScript from pythonExecutor module
const Disease = require('../models/disease');
const PendingDiseaseLogs = require('../models/pendingdiseaselogs');

const User = require('../models/user');
const pendingDisease = require('../models/pendingdisease');
const { getDiseases } = require('../python/getDiseases'); // Adjust the path as needed
const { getPendingDiseases } = require('../python/getPendingDiseases'); // Adjust the path as needed
const {getSymptomsOfPendingDiseases}  = require('../python/getSymptomsOfPendingDiseases');
const {ApprovePendingDisease} = require('../python/ApprovePendingDisease');
const {TrainMyCode} = require('../python/TrainMyCode');
const {getSymptomsOfHandledDiseases}  = require('../python/getSymptomsOfHandledDiseases');


exports.getAllDiseases  = async (req, res) => {
try {
    allDiseases = await getDiseases();
    res.json(allDiseases);
    
  }  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.superDoctorAccept  = async (req, res) => {
  
  const {diseaseId,userId}= req.body;
  try {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, secretKey);
  console.log(decoded);
  const currentUser = await User.findUserById(decoded.userId);
  if (currentUser === null || currentUser === undefined)
    return res.status(404).json({ message: 'You should login' });
  if (!(currentUser.role === "SuperDoctor"))
        return res.status(404).json({ message: 'No access' });
  const diseaseE = await pendingDisease.findById(diseaseId);
  ApprovePendingDisease(diseaseE[0].name)
        .then((result) => {
            console.log("hi");
            TrainMyCode()
            .then(async (result) => {
              const timestampMs = Date.now();
              const dateString1 = new Date(timestampMs).toLocaleString();
                await pendingDisease.accept(userId,diseaseId,dateString1);
                currentUser.super_accepted_diseases= currentUser.super_accepted_diseases+1;
                await User.updateUser(currentUser);
                const posterU = await User.findUserById(diseaseE[0].poster);
                posterU.accepted_disease= posterU.accepted_disease+1;
                await User.updateUser(posterU);
                return res.status(200).json({ message: 'Done' });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
      }
  }

exports.approve  = async (req, res) => {
try{
    const token = req.headers.authorization.split(' ')[1];
    
    const decoded = jwt.verify(token, secretKey);
    
    const {diseaseId,userId}= req.body;
    const currentUser = await User.findUserById(decoded.userId);
    if (currentUser === null || currentUser === undefined)
        return res.status(404).json({ message: 'You should login' });
    if (!(currentUser.role === "SuperDoctor" || currentDisease.role === "Doctor"))
          return res.status(404).json({ message: 'No access' });
    const currentDisease = await  pendingDisease.findById(diseaseId);
    const currentDisease1= currentDisease[0];
    if (currentDisease1 === null || currentDisease1 === undefined )
        return res.status(404).json({ message: 'Disease doesn\'t exist.' });
    const timestampMs = Date.now();
    const dateString1 = new Date(timestampMs).toLocaleString();
    PendingDiseaseLogs.create(userId,diseaseId,"accepted",null,dateString1,0);
    currentDisease1.accepted_counts = currentDisease1.accepted_counts+1;
    //currentDisease.id=diseaseId;
    await pendingDisease.update(currentDisease1);
    currentUser.accepting_disease = currentUser.accepting_disease+1;
    await User.updateUser(currentUser);
    res.status(200).json(currentDisease1);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}


exports.disapproveBySuperDoctor  = async (req, res) => {
  try{
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secretKey);
      console.log(decoded);
      const {reason}= req.body;
      const diseaseId = req.params.id;
      const currentUser = await User.findUserById(decoded.userId);
      if (reason === null || reason === undefined || reason === '')
        return res.status(404).json({ message: 'Reason cannot be empty.' });
      if (currentUser === null || currentUser === undefined)
        return res.status(404).json({ message: 'You should login' });
      if (!(currentUser.role === "SuperDoctor" ))
            return res.status(404).json({ message: 'No access' });
      const currentDisease = await  pendingDisease.findById(diseaseId);
      const currentDisease1= currentDisease[0];
      if (currentDisease1 === null || currentDisease1 === undefined )
        return res.status(404).json({ message: 'Disease doesn\'t exist.' });
      const timestampMs = Date.now();
      const dateString1 = new Date(timestampMs).toLocaleString();
      PendingDiseaseLogs.create(decoded.userId,diseaseId,"Rejected",reason,dateString1,1);
      currentDisease1.reason=reason;
      currentDisease1.status="Rejected";
      //currentDisease.id=diseaseId;
      await pendingDisease.update(currentDisease1);
      currentUser.super_refused_diseases	= currentUser.super_refused_diseases+1;
      await User.updateUser(currentUser);
      const posterU = await User.findUserById(currentDisease1.poster);
      posterU.refused_disease	= posterU.refused_disease+1;
      await User.updateUser(posterU);
      res.status(200).json(currentDisease1);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
exports.disapproveByDoctor  = async (req, res) => {
try{
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    const {reason}= req.body;
    const diseaseId = req.params.id;
    const currentUser = await User.findUserById(decoded.userId);
    if (reason === null || reason === undefined || reason === '')
      return res.status(404).json({ message: 'Reason cannot be empty.' });
    if (currentUser === null || currentUser === undefined)
      return res.status(404).json({ message: 'You should login' });
    if (!(currentUser.role === "SuperDoctor" || currentDisease.role === "Doctor"))
          return res.status(404).json({ message: 'No access' });
    const currentDisease = await  pendingDisease.findById(diseaseId);
    const currentDisease1= currentDisease[0];
    if (currentDisease1 === null || currentDisease1 === undefined )
      return res.status(404).json({ message: 'Disease doesn\'t exist.' });
    const timestampMs = Date.now();
    const dateString1 = new Date(timestampMs).toLocaleString();
    PendingDiseaseLogs.create(decoded.userId,diseaseId,"Rejected",reason,dateString1,0);
    currentDisease1.refused_counts = currentDisease1.refused_counts+1;
    console.log(currentDisease1.accepted_counts);
    //currentDisease.id=diseaseId;
    await pendingDisease.update(currentDisease1);
    currentUser.refusing_disease= currentUser.refusing_disease+1;
    console.log(currentUser.refusing_disease);
    await User.updateUser(currentUser);
    res.status(200).json(currentDisease1);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

exports.verifyDiseaseHandler  = async (req, res) => {
const {userId,diseaseId}= req.body;
const pendingDisease1 = await PendingDiseaseLogs.verifyHandler(userId,diseaseId);

res.json(pendingDisease1[0] == undefined || pendingDisease1[0] == null  )
}

exports.getSymtompsByDiseaseNameH  = async (req, res) => {
const {diseaseName}= req.body;
console.log(diseaseName);
getSymptomsOfHandledDiseases(diseaseName)
  .then((result) => {
    console.log(result);
    res.json(result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
exports.getSymtompsByDiseaseNameP  = async (req, res) => {

const {diseaseName}= req.body;
  getSymptomsOfPendingDiseases(diseaseName)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
exports.getReasonById  = async (req, res) => {
  const {diseaseIds}= req.body;
    let requestIdInt = parseInt(diseaseIds, 10);
    const e = await  PendingDiseaseLogs.getReasonsByDiseaseId(requestIdInt);
    res.json(e);
}
exports.getPendingDiseaseById  = async (req, res) => {

const {diseaseIds}= req.body;
  let requestIdInt = parseInt(diseaseIds, 10);
  const e = await  pendingDisease.findById(requestIdInt);
  res.json(e[0]);
}
exports.getPendingDiseasesDB  = async (req, res) => {
const {nameD}= req.body;
  const e = await  pendingDisease.findByDiseaseName(nameD);
  res.json(e[0]);
}
exports.getPendingDiseases  = async (req, res) => {
const result = await getPendingDiseases();
res.json(result);
}

exports.addDisease  = async (req, res) => {
const { diseasename1, symptoms, userId} = req.body;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const currentUser = await User.findUserById(decoded.userId);
    if (currentUser === null || currentUser === undefined)
        return res.status(404).json({ message: 'You need to login' });
    if (!(currentUser.role ==="SuperDoctor" || currentUser.role ==="Doctor" ))
      return res.status(404).json({ message: 'You don\'t have permission' });
    const output = await runPy();
    let symptomsList = output.split(",");
    symptomsList.pop();

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
    symptomsObject["prognosis"]=diseasename1;
    console.log(symptomsObject);
    symptomsList.push("prognosis");
    console.log(symptomsList[symptomsList.length - 1]); // Outputs: "Headache"
    const dataToWrite = { symptoms: symptomsObject, allSymptoms: symptomsList };
    executePythonScript2(dataToWrite)
    .then((result) => {
      executePythonScript3(dataToWrite)
    .then((result) => {
      const timestampMs = Date.now();
      const dateString1 = new Date(timestampMs).toLocaleString();
      currentUser.posted_disease=currentUser.posted_disease+1;
      User.updateUser(currentUser);
      pendingDisease.create(currentUser.id,diseasename1,dateString1);
      return res.status(200).json({ message: 'Done' });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



exports.getIdOfPendingDiseaseByName = async (req, res) => {
  const { diseasename2 } = req.body; // Extract diseasename from the request body
  try {
    console.log(diseasename2);
    const pendingDisease1 = await pendingDisease.getDiseaseByDiseaseName(diseasename2);
    console.log(pendingDisease1);
    return res.status(200).json({ id: pendingDisease1[0].id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.findDiseaseByNameAddingDisease = async (req, res) => {
  const { diseasename } = req.body; // Extract diseasename from the request body
  try {
    const result = await getDiseases(); // Fetch diseases
    const diseasesArray = result.split(","); // Split the result into an array
    if (diseasesArray.some(disease => disease.toLowerCase() === diseasename.toLowerCase())) {
      return res.status(200).json({ message: "Disease found in the final dataset.", exists: true });
    }

    const result2 = await getPendingDiseases();
    const diseasesArray2 = result2.split(","); // Split the result into an array
    if (diseasesArray2.some(disease => disease.toLowerCase() === diseasename.toLowerCase())) {
      return res.status(200).json({ message: "Disease found as a pending request. ", exists: true });
    }
    res.status(404).json({ message: "Disease not found", exists: false });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
exports.findDiseaseByName  = async (req, res) => {
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
}
exports.getSymtomps  = async (req, res) => {
        try {
            const output = await runPy();
            const cleanedOutput = output.replace(/,prognosis/g, '');
            res.json(cleanedOutput);
        } catch (error) {
            console.error('Error in getsymptoms route:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
}

exports.getAllDiseasesDB  = async (req, res) => {
  const diseases = await Disease.getAllDiseases();
  res.json(diseases);
}



exports.getDiseaseByUser  = async (req, res) => {

const userId = req.body.userId;
const diseases = await Disease.getDiseasesByUser(userId);
console.log(diseases);

res.json(diseases);
}
exports.getDiseaseOfClients = async (req, res) => {
  try {
    const data = await Disease.getAllDiseases();

    // Step 1: Count the occurrences of each disease
    const diseaseCounts = data.reduce((acc, item) => {
      acc[item.disease] = (acc[item.disease] || 0) + 1;
      return acc;
    }, {});

    // Step 2: Get unique diseases with their counts and sort by count in descending order
    const uniqueDiseases = Object.keys(diseaseCounts).map(disease => ({
      disease,
      count: diseaseCounts[disease]
    })).sort((a, b) => b.count - a.count);

    // Step 3: Send the data with counts
    res.json(uniqueDiseases);
  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({ error: 'An error occurred while fetching diseases.' });
  }
};



exports.findDiseases  = async (req, res) => {
try {
    // Get the list of symptoms from the Python script
    let symptomsListJson = await runPy();
   // let symptomsList = JSON.parse(symptomsListJson); // Ensure parsing JSON string
   let symptomsList = symptomsListJson.split(",");
   let userId = req.body.symptoms[req.body.symptoms.length - 1];
   let userIdInt = parseInt(userId, 10);
   let currentUser = await User.findUserById(userIdInt);
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
    console.log(symptomsObject)
    
    // Execute the Python script with the formatted symptoms object
    let result = await executePythonScript(symptomsObject);
    console.log(result);
    executePythonScript(symptomsObject)
    .then((result) => {
      console.log('Predicted Disease: aaa', result);
      const timestampMs = Date.now();
      const dateString1 = new Date(timestampMs).toLocaleString();
      console.log(currentUser.country);
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
}