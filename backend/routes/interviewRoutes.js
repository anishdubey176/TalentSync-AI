const express = require('express');
const router = express.Router();
const { generateMockInterview, evaluateMockInterview, validateAnswer, chatPractice } = require('../controllers/interviewController');

router.post('/generate', generateMockInterview);
router.post('/evaluate', evaluateMockInterview);
router.post('/validate-answer', validateAnswer);
router.post('/practice/chat', chatPractice);

module.exports = router;
