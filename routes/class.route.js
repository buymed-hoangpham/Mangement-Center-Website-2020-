const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');

router.get('/', classController.render);
router.get('/delete/:id', classController.delete);
router.get('/view/:id', classController.view);
router.get('/view/remove/:id', classController.removeStudent);
router.get('/create', classController.create);
router.post('/create', classController.postCreate);
router.get('/addStudent', classController.addStudent);
router.post('/addStudent', classController.postAddStudent);

module.exports = router;