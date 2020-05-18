const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
        classname: String,
        number: Number,
        type: String,
        teacherid: String,
    }, {
        versionKey: false 
});

var Class = mongoose.model('Class', classSchema, 'classes');

module.exports = Class;