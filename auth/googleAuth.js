import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();
//
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, //these values are stored in the .env file and accessed using process.env, this is done to keep the sensitive information like client ID and client secret secure and not hardcoded in the code
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://movie-review-site-production.up.railway.app/auth/google/callback" //this is the URL that Google will redirect to after the user has authenticated, this URL should be registered in the Google Developer Console for the OAuth credentials, this is where we will handle the logic to create or find the user in our database and then log them in
},
async (accessToken, refreshToken, profile, done) => { //this is the callback function that will be called after the user has authenticated with Google, it takes the access token, refresh token, user profile, and a done callback as parameters, this is where we will handle the logic to create or find the user in our database and then log them in

  const user = {
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value
  };

  return done(null, user); //calling the done callback with the user object to indicate that the authentication was successful and to log the user in, the first parameter is null to indicate that there was no error, and the second parameter is the user object that will be stored in the session and can be accessed in the request object for any authenticated routes
}));

passport.serializeUser((user, done) => { //this is the function that will be called to serialize the user object into the session, it takes the user object and a done callback as parameters, this is where we can choose what information from the user object we want to store in the session, in this case, we are storing the entire user object, but in a real application, you might want to store only the user ID or some other identifier to keep the session size small
  done(null, user);
});

passport.deserializeUser((user, done) => { //this is the function that will be called to deserialize the user object from the session, it takes the user object from the session and a done callback as parameters, this is where we can retrieve the full user information from the database using the identifier stored in the session, in this case, since we are storing the entire user object in the session, we can just return it as is, but in a real application, you would typically query the database to get the full user information based on the identifier stored in the session. difference between this and serializeUser is that serializeUser is called when the user logs in and we want to store some information in the session, while deserializeUser is called on every request to retrieve the user information from the session and make it available in the request object for any authenticated routes
  done(null, user);
});