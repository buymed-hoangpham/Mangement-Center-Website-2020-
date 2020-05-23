const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
        _id: String,
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