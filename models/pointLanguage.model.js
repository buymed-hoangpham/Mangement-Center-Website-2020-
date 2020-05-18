const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointLanguageSchema = new Schema({
        userid: String,
        classid: String,
        type: String,
        writing: Number,
        listening: Number,
        speaking: Number,
        reading: Number,
        obs: Number,
        cefr: String
    }, {
        versionKey: false 
});

var pointLanguage = mongoose.model('pointLanguage', pointLanguageSchema, 'pointLanguage');

module.exports = pointLanguage;