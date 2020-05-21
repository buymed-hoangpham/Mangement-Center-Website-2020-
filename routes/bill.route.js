const express = require('express');
const router = express.Router();
const billController = require('../controllers/bill.controller');

router.get('/', billController.render);
router.get('/delete/:id', billController.delete);
router.get('/view/:id', billController.view);
router.post('/view', billController.postView);
router.get('/create', billController.create);
router.post('/create', billController.postCreate);

module.exports = router;