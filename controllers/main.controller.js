const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Bill = require('../models/bill.model');
const CertiIT = require('../models/certiIT.model');
const CertiLanguage = require('../models/certiLanguage.model');

module.exports.render = async(req, res) => {
    let classes = await Class.countDocuments();
    let students = await Student.countDocuments()
    let teachers = await Teacher.countDocuments();
    let bills = await Bill.countDocuments();
    let certiesIT = await CertiIT.countDocuments();
    let certiesLanguage = await CertiLanguage.countDocuments();
    let certies = certiesIT + certiesLanguage;
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
        certies,
        amount: amount[0].total
    });
};