const moment = require('moment');
const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');

module.exports.render = async(req, res) => {
    let classes = await Class.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(classes.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;

    res.render('./class/index', {
        classes: classes.slice(begin, end),
        count,
        titleLink: 'class',
        pageSize,
        currentPage
    });
};

module.exports.delete = async(req, res) => {
    await Class.findByIdAndRemove(req.params.id);
    res.redirect('back');
};

module.exports.view = async(req, res) => {
    let thisClass = await Class.findById(req.params.id);
    let students = await Student.find({ classId: thisClass.id });
    let teacher = await Teacher.findOne({ classId: thisClass.id });
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(students.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;

    res.render('./class/view', {
        thisClass,
        teacher,
        moment,
        students: students.slice(begin, end),
        count,
        titleLink: 'class/view/' + req.params.id,
        pageSize,
        currentPage
    });
};

module.exports.removeStudent = async(req, res) => {
    let student = await Student.findByIdAndUpdate(req.params.id, { classId: '' });
    res.redirect('back');
};

module.exports.create = async(req, res) => {
    let count = 0;
    let students = await Student.find();
    let teachers = await Teacher.find();
    res.render('./class/create', {
        count,
        students,
        teachers
    });
};

module.exports.postCreate = async(req, res) => {
    let count = 0;
    let students = await Student.find();
    let teachers = await Teacher.find();
    let classname = req.body.classname;
    let teacher = req.body.teachername;
    let arrOption = req.body.optionValue;
    let arrStudentId = [];
    let successMessage = '';
    let errorMessage = '';
    let data = {
        classname,
        number: arrOption.length
    };
    
    
    await Class.create(data);
    let classStudy = await Class.findOne({ classname: classname });
    for(var i = 0; i < arrOption.length; i++) {
        arrStudentId.push(arrOption[i].replace('Id: ', '').split(' - Tên: ').shift());
    }
    for(var i = 0; i < arrStudentId.length; i++) {
        await Student.findOneAndUpdate({ _id: arrStudentId[i] },
            { $push: { classId: classStudy.id } },
            (error, success) => {
                (success) ? successMessage = 'Tạo lớp mới thành công!' : errorMessage = 'Tạo lớp mới thất bại!'; 
        });
    }

    res.render('./class/create', {
        count,
        students,
        successMessage,
        errorMessage,
        teachers
    });
};