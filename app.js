require('dotenv').config();

const express = require('express');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const mainRouter = require('./routes/main.route');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const classRouter = require('./routes/class.route');
const teacherRouter = require('./routes/teacher.route');
const studentRouter = require('./routes/student.route');
const pointRouter = require('./routes/point.route');
const certiRouter = require('./routes/certi.route');
const billRouter = require('./routes/bill.route');

const requireAuthMiddleware = require('./middlewares/auth.middleware');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(express.static('files'));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use('/auth', authRouter);
app.use('/', requireAuthMiddleware, mainRouter);
app.use('/user', requireAuthMiddleware, userRouter);
app.use('/class', requireAuthMiddleware, classRouter);
app.use('/teacher', requireAuthMiddleware, teacherRouter);
app.use('/student', requireAuthMiddleware, studentRouter);
app.use('/point', requireAuthMiddleware, pointRouter);
app.use('/certi', requireAuthMiddleware, certiRouter);
app.use('/bill', requireAuthMiddleware, billRouter);

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.use((req,res,next)=>{
    res.status(404).render('errors', {errors: "404 Error"})
})

// Error in /books.controller
function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}
function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ errors: 'Something failed!' })
    } else {
        next(err)
    }
}
function errorHandler (err, req, res, next) {
    res.status(500).render('errors', {errors: "500 Error"})
}

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT);
});