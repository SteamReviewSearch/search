const express = require('express');
const router = express.Router();

const UserAnalyzeController = require('../controllers/user_analyze_controller');
const userAnalyzeController = new UserAnalyzeController();

router.get('/best', userAnalyzeController.bestGame);

router.get('/:user_id', userAnalyzeController.userBestGame);

module.exports = router;