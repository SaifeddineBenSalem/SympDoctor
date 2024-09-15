const express = require('express');
const router = express.Router();

const diseaseController = require('../Controllers/diseaseController');


router.post('/getalldiseases', diseaseController.getAllDiseases);
router.post('/superdoctoraccept', diseaseController.superDoctorAccept);
router.post('/approve', diseaseController.approve);
router.post('/disapprovebydoctor/:id', diseaseController.disapproveByDoctor);
router.post('/disapprovebysuperdoctor/:id', diseaseController.disapproveBySuperDoctor);


router.post('/verifydiseasehandler', diseaseController.verifyDiseaseHandler);

router.post('/getsymtompsbydiseasenameh', diseaseController.getSymtompsByDiseaseNameH);
router.post('/getsymtompsbydiseasenamep', diseaseController.getSymtompsByDiseaseNameP);

router.post('/getpendingdiseasebyid', diseaseController.getPendingDiseaseById);
router.post('/getreasonsbyid', diseaseController.getReasonById);


router.post('/getpendingdiseasesdb', diseaseController.getPendingDiseasesDB);
router.post('/getpendingdiseases', diseaseController.getPendingDiseases);
router.post('/adddisease', diseaseController.addDisease);
router.post('/finddiseasebyname', diseaseController.findDiseaseByName);
router.post('/finddiseasebynameaddingdisease', diseaseController.findDiseaseByNameAddingDisease);


router.get('/getsymptoms', diseaseController.getSymtomps);
router.post('/getdiseasesbyuser', diseaseController.getDiseaseByUser);
router.post('/getalldiseasesdb', diseaseController.getAllDiseasesDB);
router.post('/getidofpendingdiseasebyname', diseaseController.getIdOfPendingDiseaseByName);


router.post('/getdiseasesofclients', diseaseController.getDiseaseOfClients);

router.post('/finddiseases', diseaseController.findDiseases);


module.exports = router;
