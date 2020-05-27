const shortid = require('shortid');
const moment = require('moment')
const Class = require('../models/class.model');
const Student = require('../models/student.model');
const CertiLanguage = require('../models/certiLanguage.model');
const CertiIT = require('../models/certiIT.model');
const PointIT = require('../models/pointIT.model');
const PointLanguage = require('../models/pointLanguage.model');

module.exports.selectType = (req, res) => {
    res.render('./certi/selectType')
}

module.exports.render = async(req, res) => {
    let students = await Student.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;
    let placeholderSearch = 'Search...';

    if(req.params.type == "T") {
        let certies = await CertiIT.find();
        let pageSize = Math.ceil(certies.length / perPage );
        res.render('./certi/index', {
            certies: certies.slice(begin, end),
            students,
            count,
            titleLink: 'certi',
            pageSize,
            currentPage,
            placeholderSearch
        })
        return;
    } else {
        let certies = await CertiLanguage.find();
        let pageSize = Math.ceil(certies.length / perPage );
        res.render('./certi/index', {
            certies: certies.slice(begin, end),
            students,
            count,
            titleLink: 'certi',
            pageSize,
            currentPage,
            placeholderSearch
        })
    }
}

module.exports.delete = async(req, res) => {
    let certiIT = await CertiIT.findById(req.params.id);
    if(certiIT) {
        await CertiIT.findByIdAndRemove(req.params.id);
        res.redirect('back');
        return;
    }
    await CertiLanguage.findByIdAndRemove(req.params.id);
    res.redirect('back');
};

module.exports.create = async(req, res) => {
    let classes = await Class.find();
    let students = await Student.find();
    
    res.render('./certi/create', {
        students,
        classes
    })
}

module.exports.postCreate = async (req, res) => {
    let _id = shortid.generate();
    let type = req.body.type;
    let classes = await Class.find();
    let students = await Student.find();
    let errorMessage = '';
    let successMessage = '';

    if(type == 'L') {
        let point = await PointLanguage.findOne({ userid: req.body.student, classid: req.body.class })
        if(!point) {
            let errorMessage = 'Học viên không có điểm! Không thể tạo chứng chỉ!'
            res.render('./certi/create', {
                students,
                classes,
                errorMessage
            })
            return;
        }
        if(point.cefr == 'f') {
            let errorMessage = 'Học viên không đạt điểm đậu! Không thể tạo chứng chỉ!'
            res.render('./certi/create', {
                students,
                classes,
                errorMessage
            })
            return;
        }
        let data = {
            _id,
            studentid: req.body.student, 
            result: point.cefr,
            type,
            classid: req.body.class
        }

        let newCerti = await CertiLanguage.create(data);
        ! newCerti ? errorMessage = 'Tạo chứng chỉ mới thất bại!' : successMessage = 'Tạo chứng chỉ mới thành công!'
        res.render('./certi/create', {
            students,
            classes,
            errorMessage, 
            successMessage
        })
        return;
    } else {
        let point = await PointIT.findOne({ userid: req.body.student, classid: req.body.class })
        if(!point) {
            let errorMessage = 'Học viên không có điểm! Không thể tạo chứng chỉ!'
            res.render('./certi/create', {
                students,
                classes,
                errorMessage
            })
            return;
        }
        if(point.passed == false) {
            let errorMessage = 'Học viên không đạt điểm đậu! Không thể tạo chứng chỉ!'
            res.render('./certi/create', {
                students,
                classes,
                errorMessage
            })
            return;
        }
        let data = {
            _id,
            studentid: req.body.student, 
            result: "Đạt" ,
            type,
            classid: req.body.class
        }

        let newCerti = await CertiIT.create(data);
        ! newCerti ? errorMessage = 'Tạo chứng chỉ mới thất bại!' : successMessage = 'Tạo chứng chỉ mới thành công!'
        res.render('./certi/create', {
            students,
            classes,
            errorMessage, 
            successMessage
        })
        return;
    }
}

module.exports.view = async (req, res) => {
    let certi = await CertiLanguage.findById(req.params.id);
    if(await CertiIT.findById(req.params.id)) {
        certi = await CertiIT.findById(req.params.id)
    }
    let student = await Student.findById(certi.studentid);
    let thisClass = await Class.findById(certi.classid);
    
    if(certi.type == "T") {
        let point = await PointIT.findOne({ userid: certi.studentid, classid: certi.classid })
        res.render('./certi/view', {
            student,
            thisClass,
            certi,
            moment,
            point
        })
        return;
    } else {
        let point = await PointLanguage.findOne({ userid: certi.studentid, classid: certi.classid })
        res.render('./certi/view', {
            student,
            thisClass,
            certi,
            moment,
            point
        })
        return;
    }
}

module.exports.search = async (req, res) => {
    let q = req.query.q;
    let certies = await Certi.find();
    let students = await Student.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(certies.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;
    let placeholderSearch = q;
    let matchedStudents = students.filter( student => {
        return student.studentname.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
    let idMatchedStudents = matchedStudents.map( student => {
        return student.id;
    })
    let matchedCerties = certies.filter( certi => {
        return idMatchedStudents.indexOf(certi.studentid) !== -1;
    })

    if(!matchedCerties.length) {
        placeholderSearch = 'Không tìm thấy!';
        res.render('./certi/index', {
            certies: certies.slice(begin, end),
            students,
            count,
            titleLink: 'certi',
            pageSize,
            currentPage,
            placeholderSearch
        })
        return;
    }
    res.render('./certi/index', {
        certies: matchedCerties.slice(begin, end),
        students,
        count,
        titleLink: 'certi',
        pageSize,
        currentPage,
        placeholderSearch
    })
}