const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointSchema = new Schema({
        studentname: String,
        
    }, {
        versionKey: false 
});

var Point = mongoose.model('Point', pointSchema, 'points');

module.exports = Point;