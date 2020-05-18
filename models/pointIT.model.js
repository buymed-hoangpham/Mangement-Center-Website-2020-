const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointITSchema = new Schema({
        userid: String,
        classid: String,
        type: String,
        theory: Number,
        practice: Number,
        obs: Number,
        cefr: String
    }, {
        versionKey: false 
});

var pointIT = mongoose.model('pointIT', pointITSchema, 'pointIT');

module.exports = pointIT;