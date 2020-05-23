const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const certiSchema = new Schema({
        _id: String,
        studentid: String,
        type: String,
        cefr: String,
        classid: String
    }, {
        versionKey: false 
});

var Certi = mongoose.model('Certi', certiSchema, 'certi');

module.exports = Certi;