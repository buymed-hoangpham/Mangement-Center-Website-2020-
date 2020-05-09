const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
        username: String,
        password: String,
        userAvatar: String,
        wrongLoginNumber: Number,
        email: String
    }, {
        versionKey: false 
});

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;