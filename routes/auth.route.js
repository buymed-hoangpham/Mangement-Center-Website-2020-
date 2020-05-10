const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/login', authController.login);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);
router.get('/reset', authController.reset);
router.post('/reset', authController.postReset);

module.exports = router;