const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certiSchema = new Schema({
        studentid: String,
        type: String,
        cefr: String,
        classid: String
    }, {
        versionKey: false 
});

var Certi = mongoose.model('Certi', certiSchema, 'certi');

module.exports = Certi;