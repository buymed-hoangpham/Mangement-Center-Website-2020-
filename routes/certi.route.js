const express = require('express');
const router = express.Router();
const certiController = require('../controllers/certi.controller');

router.get('/', certiController.selectType);
router.get('/delete/:id', certiController.delete);
router.get('/view/:id', certiController.view);
router.get('/create', certiController.create);
router.post('/create', certiController.postCreate);
router.get('/search', certiController.search);
router.get('/:type', certiController.render);

module.exports = router;