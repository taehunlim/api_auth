const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;
const googlePlusTokenStrategy = require('passport-google-plus-token');
const facebookTokenStrategy = require('passport-facebook-token');


const userModel = require('./models/user');

// JSON WEB TOKENS STRATEGY
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.SECRET
}, async (payload, done) => {
    try {
        // Find the user specified in token
        const user = await userModel.findById({_id: payload.sub});

        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }
        // Otherwise, return the user
        done(null, user);

    } catch (error) {
        done(error, false);
    }
}));
//// json web token strategy
// passport.use(new jwtStrategy({
//     jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey : process.env.SECRET
// }, async (payload, done) => {
//     try{
//         const user = await userModel.findById(payload.sub);
//         if(!user) {
//             return done(null, false);
//         }
//         else{
//             done(null, user);
//         }
//
//     } catch (error) {
//         done(error, false);
//     }
// }));


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


// google auth strategy
passport.use('googleToken', new googlePlusTokenStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try{
        const existingUser = await userModel.findOne({'google.id': profile.id});
        if(existingUser) {
            return done(null, existingUser);
        }
        else{
            const newUser = new userModel({
               method : 'google',
               google : {
                   id : profile.id,
                   email : profile.emails[0].value,
                   avatar : profile.photos[0].value
               }
            });

            await newUser.save();
            done(null, newUser);

        }
    }
    catch(error) {
        done(error, false, error.message);
    }
    // console.log('profile', profile);
    // console.log('refreshToken', refreshToken);
    // console.log('accessToken', accessToken);
}));


passport.use('facebookToken', new facebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECERET
}, async (accessToken, refreshToken, profile, done) => {
    try{
        const existingUser = await userModel.findOne({'facebook.id' : profile.id});
        if(existingUser){
            return done(null, existingUser);
        }
        else{
            const newUser = new userModel({
               method : 'facebook',
               facebook : {
                   id : profile.id,
                   email : profile.emails[0].value,
                   avatar : profile.photos[0].value
               }
            });
            await newUser.save();
            done(null, newUser)
        }
    }
    catch(error) {
        done(error, false, error.message);
    }
    // console.log('profile', profile);
    // console.log('refreshToken', refreshToken);
    // console.log('accessToken', accessToken);
}));