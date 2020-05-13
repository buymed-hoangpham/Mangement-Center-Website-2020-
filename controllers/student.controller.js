const cloudinary = require('cloudinary').v2;
const moment = require('moment');
const Student = require('../models/student.model');
const Class = require('../models/class.model');

module.exports.render = async(req, res) => {
    let students = await Student.find();
    let classes = await Class.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(students.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;

    res.render('./student/index', {
        students: students.splice(begin, end),
        count,
        titleLink: 'student',
        pageSize,
        currentPage,
        classes,
        moment
    });
};

module.exports.delete = async(req, res) => {
    let student = student.findById(req.params.id);
    let oldavatarId = student.avatar.split('/').pop();
    let deleteOldAvatar = await cloudinary.uploader.destroy("management-center/studentAvatar/" + oldavatarId );
    await student.remove();
    res.redirect('back');
};

module.exports.create = async(req, res) => {
    let classes = await Class.find();
    res.render('./student/create', {
        classes
    });
};

module.exports.postCreate = async(req, res) => {
    let classes = await Class.find();
    let file = req.file.path;
    let avatarId = file.split('\\').pop();
    let uploading = await cloudinary.uploader.upload(file, { public_id: "management-center/studentAvatar/" + avatarId });
    let avatar = await cloudinary.url(uploading.public_id);
    let data = {
        studentname: req.body.studentname,
        gender: req.body.gender,
        birthday: req.body.birthday,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        classId: req.body.class,
        avatar
    };

    if(!await Student.create(data)) {
        let error = 'Thêm học viên không thành công!';
        res.render('./student/create', {
            error,
            classes
        });
        return;
    }

    let success = 'Thêm học viên thành công!';
    res.render('./student/create', {
        success,
        classes
    });
};

module.exports.view = async(req, res) => {
    let student = await Student.findById(req.params.id);
    let classes = await Class.find();
    let classTeaching = await Class.findById(student.classId);
    res.render('./student/view', {
        student,
        classTeaching,
        classes,
        moment
    });
};

module.exports.postView = async(req, res) => {
    let student = await Student.findById(req.body.id);
    let gender = req.body.gender === "Nam" ? false : true;
    let birthdayArr = (req.body.birthday).split('-');
    let birthday = new Date(birthdayArr[2], birthdayArr[1] - 1, birthdayArr[0]);
    if(!req.file || !req.file.path) {
        let data = {
            studentname: req.body.studentname,
            gender,
            birthday,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            classId: req.body.class,
        }
        await Student.findByIdAndUpdate(req.body.id, data);
        student = await Student.findById(req.body.id);
        let classes = await Class.find();
        let classTeaching = await Class.findById(student.classId);
        res.render('./student/view', {
            student,
            classTeaching,
            classes,
            moment
        });
        return;
    } 
    let file = req.file.path;
    let newavatarId = file.split('\\').pop();
    let oldavatarId = student.avatar.split('/').pop();
    let deleteOldAvatar = await cloudinary.uploader .destroy("management-center/studentAvatar/" + oldavatarId);
    let uploading = await cloudinary.uploader.upload(file, { public_id: "management-center/studentAvatar/" + newavatarId });
    let avatar = await cloudinary.url(uploading.public_id);
    let data = {
        studentname: req.body.studentname,
        gender,
        birthday,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        classId: req.body.class,
        avatar
    }

    await Student.findByIdAndUpdate(req.body.id, data);
    student = await Student.findById(req.body.id);
    let classes = await Class.find();
    let classTeaching = await Class.findById(student.classId);
    res.render('./student/view', {
        student,
        classTeaching,
        classes,
        moment
    });
};