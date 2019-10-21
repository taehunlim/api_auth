const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({

    method : {
        type : String,
        enum : ['local', 'google', 'facebook'],
        required : true
    },
    local : {
        username : {
            type : String
        },
        email : {
            type : String,
            lowercase : true //ㄷㅐ문자가 입력되 무조건 소문자도로 들어감
        },
        password : {
            type : String
        }
    },

    facebook : {},
    google : {},

    data : {
        type :Date,
        default : Date.now()
    }
});

userSchema.pre('save', async function(next) {
   try {
       console.log('entered');
       if(this.method !== 'local') {
           next(); // = return
       }
       else{
           const salt = await bcrypt.genSalt(10);
           const passwordHash = await bcrypt.hash(this.local.password, salt);
           this.local.password = passwordHash;
           console.log('exited');
           next();
       }
   }
   catch(error) {
       next(error);
   }
});



userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    }
    catch (error) {
        throw new Error(error);
    }
}


module.exports = mongoose.model('users', userSchema);

//date,email,password, username