const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const certiITSchema = new Schema({
        _id: String,
        studentid: String,
        type: String,
        classid: String,
        result: String,
    }, {
        versionKey: false 
});

var CertiIT = mongoose.model('CertiIT', certiITSchema, 'certiIT');

module.exports = CertiIT;