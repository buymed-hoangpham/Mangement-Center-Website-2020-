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

app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(express.static('files'));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use('/', mainRouter);
app.use('/login', authRouter);

app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT);
});