const cloudinary = require('cloudinary').v2;
const moment = require('moment');
const Teacher = require('../models/teacher.model');
const Class = require('../models/class.model');

module.exports.render = async(req, res) => {
    let teachers = await Teacher.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(teachers.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;

    res.render('./teacher/index', {
        teachers: teachers.splice(begin, end),
        count,
        titleLink: 'teacher',
        pageSize,
        currentPage,
        moment: require('moment')
    });
};


module.exports.delete = async(req, res) => {
    await Teacher.findByIdAndRemove(req.params.id);
    res.redirect('back');
};

module.exports.create = async(req, res) => {
    let classes = await Class.find();
    res.render('./teacher/create', {
        classes
    });
};

module.exports.postCreate = async(req, res) => {
    let classes = await Class.find();
    let file = req.file.path;
    let avatarId = file.split('\\').pop();
    let uploading = await cloudinary.uploader.upload(file, { public_id: "management-center/teacherAvatar/" + avatarId });
    let avatar = await cloudinary.url(uploading.public_id);
    let data = {
        teachername: req.body.teachername,
        gender: req.body.gender,
        birthday: req.body.birthday,
        phone: req.body.phone,
        address: req.body.address,
        classId: req.body.class,
        avatar
    };

    if(!await Teacher.create(data)) {
        let error = 'Thêm giáo viên không thành công!';
        res.render('./teacher/create', {
            error,
            classes
        });
        return;
    }

    let success = 'Thêm giáo viên thành công!';
    res.render('./teacher/create', {
        success,
        classes
    });
};