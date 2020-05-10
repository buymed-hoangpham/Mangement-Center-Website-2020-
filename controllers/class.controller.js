const Class = require('../models/class.model');

module.exports.render = async(req, res) => {
    let classes = await Class.find();
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 7;
    let pageSize = Math.ceil(classes.length / perPage );
    let begin = (currentPage - 1) * perPage;
    let end = currentPage * perPage;
    let count = begin;

    res.render('./class/index', {
        classes: classes.splice(begin, end),
        count,
        titleLink: 'class',
        pageSize,
        currentPage
    });
};

module.exports.delete = async(req, res) => {
    await Class.findByIdAndRemove(req.params.id);
    res.redirect('back');
};