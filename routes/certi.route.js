const express = require('express');
const router = express.Router();
const certiController = require('../controllers/certi.controller');

router.get('/', certiController.render);
router.get('/delete/:id', certiController.delete);
router.get('/view/:id', certiController.view);
// router.get('/view/remove/:id', classController.removeStudent);
router.get('/create', certiController.create);
router.post('/create', certiController.postCreate);

module.exports = router;