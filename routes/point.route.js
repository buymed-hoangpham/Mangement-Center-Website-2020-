const express = require('express');
const router = express.Router();
const classController = require('../controllers/point.controller');

router.get('/', classController.render);
router.get('/view/:id', classController.view);
router.post('/view', classController.postRender);
router.post('/view/update', classController.postView);
// router.get('/delete/:id', classController.delete);
// router.get('/view/:id', classController.view);
// router.get('/view/remove/:id', classController.removeStudent);
// router.get('/create', classController.create);
// router.post('/create', classController.postCreate);

module.exports = router;