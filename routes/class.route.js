const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');

router.get('/', classController.render);
router.get('/delete/:id', classController.delete);

module.exports = router;