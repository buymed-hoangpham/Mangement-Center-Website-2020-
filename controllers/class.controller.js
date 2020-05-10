const Class = require('../models/class.model');

module.exports.render = async(req, res) => {
    // let class = Class.find();
    res.render('./class/index');
};