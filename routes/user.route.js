const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/change', userController.change);
router.post('/change', userController.postChange);

module.exports = router;