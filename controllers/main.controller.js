const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Bill = require('../models/bill.model');
// const Certi = require('../models/certi.model');

module.exports.render = async(req, res) => {
    let classes = await Class.countDocuments();
    let students = await Student.countDocuments()
    let teachers = await Teacher.countDocuments();
    let bills = await Bill.countDocuments();
    // let certies = await Certi.countDocuments();
    let amount = await Bill.aggregate([
        { $match: {} },
        { $group: {
            _id: null,
            total: { $sum: "$money" }
        }}
    ]);
    res.render('./index', {
        classes,
        students,
        teachers,
        bills,
        // certies,
        amount: amount[0].total
    });
};