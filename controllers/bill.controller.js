const shortid = require('shortid');
const moment = require('moment');
const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Bill = require('../models/bill.model');

module.exports.render = async(req, res) => {
    let bills = await Bill.find();
    let students = await Student.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(bills.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;
    res.render('./bill/index', {
        bills: bills.slice(begin, end), 
        students,
        count,
        titleLink: 'bill',
        pageSize,
        currentPage
    })
}

module.exports.delete = async(req, res) => {
    await Bill.findByIdAndRemove(req.params.id);
    res.redirect('back');
};

module.exports.view = async(req, res) => {
    let idBill = req.params.id;
    let bill = await Bill.findById(idBill);
    let student = await Student.findById(bill.studentid)
    res.render('./bill/view', {
        bill,
        student,
        moment
    })
}

module.exports.postView = async(req, res) => {
    let idBill = req.body.id;
    let reason = req.body.reason;
    let money = req.body.money;
    let dateArr = (req.body.date).split('-');
    let date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
    let bill = await Bill.findById(idBill);
    let student = await Student.findById(bill.studentid);
    let successMessage = 'Cập nhật thành công!'
    let dataBill = {
        reason,
        date,
        money
    }

    await Bill.findByIdAndUpdate( idBill, dataBill );
    let findBill = await Bill.findOne( dataBill );
    if( ! findBill ) {
        let errorMessage = 'Cập nhật không thành công!';
        res.redirect('back')
        return;
    } 

    res.render('./bill/view', {
        successMessage,
        bill: findBill,
        student,
        moment
    })
}

module.exports.create = async (req, res) => {
    let classes = await Class.find();
    let students = await Student.find()

    res.render('./bill/create', {
        classes,
        students,
    })
}

module.exports.postCreate = async (req, res) => {
    let _id = shortid.generate();
    let classes = await Class.find();
    let students = await Student.find()
    let successMessage = 'Tạo biên lai thành công!'
    let data = {
        _id,
        studentid: req.body.student,
        money: req.body.money,
        reason: req.body.reason,
        date: req.body.date
    }

    await Bill.create(data)
    let findBill = await Bill.findOne(data)
    if(!findBill) {
        let errorMessage = 'Tạo biên lai không thành công!'
        res.render('./bill/create', {
            errorMessage,
            classes,
            students,
        })
        return;
    }
    res.render('./bill/create', {
        successMessage,
        classes,
        students,
    })
}