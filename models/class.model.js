const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
        classname: String,
        number: Number
    }, {
        versionKey: false 
});

var Class = mongoose.model('Class', classSchema, 'classes');

module.exports = Class;