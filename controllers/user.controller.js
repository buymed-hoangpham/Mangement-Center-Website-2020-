const cloudinary = require('cloudinary').v2;
const User = require('../models/user.model');

module.exports.change = (req, res) => {
    res.render('./user/change');
};

module.exports.postChange = async (req, res) => {
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    let retypenewPassword = req.body.retypenewPassword;
    let user = await User.findById(req.signedCookies.userId);
    let errors = [];
    let success = 'Mật khẩu thay đổi thành công!'

    if(password !== user.password) {
        errors.push('Mật khẩu hiện tại không đúng!');
        res.render('./user/change', {
            errors: errors
        });
        return;
    }

    if(newPassword !== retypenewPassword) {
        errors.push('Mật khẩu mới không trùng nhau!');
        res.render('./user/change', {
            errors: errors
        });
        return;
    }

    user.password = newPassword;
    await user.save();
    res.render('./user/change', {
        success: success
    });
};