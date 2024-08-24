const express = require('express');
const { addSchool, listSchools } = require('../controllers/schoolController');

const router = express.Router();

router.post('/add', addSchool);
router.get('/list', listSchools);

module.exports = router;
