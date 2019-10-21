const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true //ㄷㅐ문자가 입력되 무조건 소문자도로 들어감
    },
    password : {
        type : String,
        required : true
    },
    data : {
        type :Date,
        default : Date.now()
    }
});



module.exports = mongoose.model('users', userSchema);

//date,email,password, username