const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
const studentController = require('../controllers/student.controller');

router.get('/', studentController.render);
router.get('/delete/:id', studentController.delete);
router.get('/create', studentController.create);
router.post('/create', upload.single('avatar'), studentController.postCreate);
router.get('/view/:id', studentController.view);
router.post('/view', upload.single('avatar'), studentController.postView);

module.exports = router;