const cloudinary = require('cloudinary').v2;
const moment = require('moment');
const Teacher = require('../models/teacher.model');
const Class = require('../models/class.model');

module.exports.render = async(req, res) => {
    let teachers = await Teacher.find();
    let classes = await Class.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(teachers.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;

    res.render('./teacher/index', {
        teachers: teachers.slice(begin, end),
        count,
        titleLink: 'teacher',
        pageSize,
        currentPage,
        classes,
        moment
    });
};

module.exports.delete = async(req, res) => {
    let teacher = Teacher.findById(req.params.id);
    let oldavatarId = teacher.avatar.split('/').pop();
    let deleteOldAvatar = await cloudinary.uploader.destroy("management-center/teacherAvatar/" + oldavatarId );
    await teacher.remove();
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

module.exports.view = async(req, res) => {
    let teacher = await Teacher.findById(req.params.id);
    let classes = await Class.find();
    let classTeaching = await Class.findById(teacher.classId);
    res.render('./teacher/view', {
        teacher,
        classTeaching,
        classes,
        moment
    });
};

module.exports.postView = async(req, res) => {
    let teacher = await Teacher.findById(req.body.id);
    let gender = req.body.gender === "Nam" ? false : true;
    let birthdayArr = (req.body.birthday).split('-');
    let birthday = new Date(birthdayArr[2], birthdayArr[1] - 1, birthdayArr[0]);
    if(!req.file || !req.file.path) {
        let data = {
            teachername: req.body.teachername,
            gender,
            birthday,
            phone: req.body.phone,
            address: req.body.address,
            classId: req.body.class,
        }
        await Teacher.findByIdAndUpdate(req.body.id, data);
        teacher = await Teacher.findById(req.body.id);
        let classes = await Class.find();
        let classTeaching = await Class.findById(teacher.classId);
        res.render('./teacher/view', {
            teacher,
            classTeaching,
            classes,
            moment
        });
        return;
    } 
    let file = req.file.path;
    let newavatarId = file.split('\\').pop();
    let oldavatarId = teacher.avatar.split('/').pop();
    let deleteOldAvatar = await cloudinary.uploader .destroy("management-center/teacherAvatar/" + oldavatarId);
    let uploading = await cloudinary.uploader.upload(file, { public_id: "management-center/teacherAvatar/" + newavatarId });
    let avatar = await cloudinary.url(uploading.public_id);
    let data = {
        teachername: req.body.teachername,
        gender,
        birthday,
        phone: req.body.phone,
        address: req.body.address,
        classId: req.body.class,
        avatar
    }

    await Teacher.findByIdAndUpdate(req.body.id, data);
    teacher = await Teacher.findById(req.body.id);
    let classes = await Class.find();
    let classTeaching = await Class.findById(teacher.classId);
    res.render('./teacher/view', {
        teacher,
        classTeaching,
        classes,
        moment
    });
};