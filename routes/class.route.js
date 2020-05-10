const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');

router.get('/', classController.render);

module.exports = router;