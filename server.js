const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const userRouter = require('./routes/user');

mongoose
    .connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("mongoDB connected"))
    .catch(err => console.log(err));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use('/user', userRouter);

const port = process.env.PORT || 4000;

app.listen(port, ()=> console.log(`server running on port ${port}`));