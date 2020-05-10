const User = require('../models/user.model');

module.exports = async(req, res, next) => {
    let userId = req.signedCookies.userId;
    let user = await User.findById(userId);
    res.locals.isLogin = false;

    if(!userId) {
        res.redirect('/auth/login');
        return;
    }

    if(!user) {
        res.redirect('/auth/login');
        return;
    }

    res.locals.user = user;
    res.locals.isLogin = true;
    next();
};