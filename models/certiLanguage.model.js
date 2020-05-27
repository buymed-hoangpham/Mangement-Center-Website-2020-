const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const certiLanguageSchema = new Schema({
        _id: String,
        studentid: String,
        type: String,
        result: String,
        classid: String,
    }, {
        versionKey: false 
});

var CertiLanguage = mongoose.model('CertiLanguage', certiLanguageSchema, 'certiLanguage');

module.exports = CertiLanguage;