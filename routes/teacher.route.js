const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
const teacherController = require('../controllers/teacher.controller');

router.get('/', teacherController.render);
router.get('/delete/:id', teacherController.delete);
router.get('/create', teacherController.create);
router.post('/create', upload.single('avatar'), teacherController.postCreate);
router.get('/view/:id', teacherController.view);
router.post('/view', upload.single('avatar'), teacherController.postView);

module.exports = router;