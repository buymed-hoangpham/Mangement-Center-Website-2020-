const shortid = require('shortid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
        teachername: String,
        gender: Boolean,
        birthday: Date,
        phone: String,
        address: String,
        classId: String,
        avatar: String
    }, {
        versionKey: false 
});

var Teacher = mongoose.model('Teacher', teacherSchema, 'teachers');

module.exports = Teacher;