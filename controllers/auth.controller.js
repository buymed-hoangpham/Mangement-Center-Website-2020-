const User = require('../models/user.model');
const sgMail = require('@sendgrid/mail');
const shortid = require('shortid');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.login = (req, res) => {
    res.render('./auth/login');
};

module.exports.postLogin = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let user = await User.findOne({ username: username });
    let errors = [];

    if(!user) {
        errors.push('Tài khoản không đúng!');
    }

    
    if(user.password !== password) {
        errors.push('Mật khẩu không đúng!');
        user.wrongLoginNumber++;
        user.save();
        if(user.wrongLoginNumber >= 4) {
            errors = [];
            errors.push('Bạn đã nhập sai mật khẩu quá nhiều lần! Vui lòng bấm vào quên mật khẩu để tạo mật khẩu mới!');
            const msg = {
                to: user.email,
                from: 'hoapha1009@gmail.com',
                subject: 'Đăng nhập quá nhiều lần',
                text: 'Xin chào! Có vẻ như ai đó đã cố gắng truy cập tài khoản bạn quá nhiều lần! Vui lòng truy cập website và đổi lại mật khẩu để đảm bảo an toàn!',
            };
            sgMail.send(msg);
        }
    }
    
    if(Object.keys(errors).length) {
        res.render('./auth/login', {
            errors: errors
        });
        return;
    }
    
    user.wrongLoginNumber = 0;
    user.save();
    res.cookie('userId', user.id, {
        signed: true
    });

    res.redirect('/');
};

module.exports.logout = (req, res) => {
    res.clearCookie('userId');
    res.render('./auth/login');
};

module.exports.reset = (req, res) => {
    res.render('./auth/reset');
};

module.exports.postReset = async (req, res) => {
    let email = req.body.email;
    let user = await User.findOne({ email: email });
    
    if(!user) {
        let error = 'Email không tồn tại!';
        res.render('./auth/reset', {
            error: error
        })
        return;
    }
    
    let newPassword = shortid.generate();
    const msg = {
        to: user.email,
        from: 'hoapha1009@gmail.com',
        subject: 'Đặt lại mật khẩu',
        text: 'Xin chào! Mật khẩu mới của bạn là: ' + newPassword
    };
    sgMail.send(msg);
    user.password = newPassword;
    user.save();

    let succeed = 'Mật khẩu mới đã được gửi đến email của bạn!';
    res.render('./auth/reset', {
        succeed: succeed
    });
}