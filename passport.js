const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;


const userModel = require('./models/user');

// json web token strategy
passport.use(new jwtStrategy({
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.SECRET
}, async (payload, done) => {
    try{
        const user = await userModel.findById(payload.sub);
        if(!user) {
            return done(null, false);
        }
        else{
            done(null, user);
        }

    } catch (error) {
        done(error, false);
    }
}));


//local strategy
passport.use(new localStrategy({
    usernameField : 'email'
}, async (email, password, done) => {
    const user = await userModel.findOne({"local.email": email});

    if(!user) {
        return done(null, false);
    }
    //check password
    const isMatch = await user.isValidPassword(password);
    if(!isMatch) {
        return done(null, false);
    }
    else {
        done(null, user);
    }
    //if not, handle
    //otherwise return the user
}));