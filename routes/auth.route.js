const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/', authController.login);
router.post('/', authController.postLogin)

module.exports = router;