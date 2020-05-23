const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
        _id: String,
        studentid: String,
        reason: String,
        money: Number,
        date: Date
    }, {
        versionKey: false 
});

var Bill = mongoose.model('Bill', billSchema, 'bill');

module.exports = Bill;