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

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT);
});