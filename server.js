import express from 'express';
import cors from 'cors'; //for cross-origin requests
import reviews from "./api/reviews.route.js"; //importing the reviews route to use it in the server

const app = express();

app.use(cors({
  origin: "http://localhost:5500",
  credentials: true
})); //to allow cross-origin requests from the frontend to the backend and to allow cookies to be sent with the requests, this is necessary for the authentication to work properly, as the user information is stored in the session cookie after they log in with Google OAuth, and we need to allow that cookie to be sent with the requests to the backend so that we can identify the user and associate their reviews with their account
app.use(express.json()); //to parse the incoming JSON data in the request body

import session from "express-session";

app.use(session({
  secret: "movie-review-secret",
  resave: false,
  saveUninitialized: true
})); //this will allow us to use sessions in our application, we can use this to store the user information when they log in, and then we can use that information to identify the user when they add a review, this will help us to implement the functionality to allow only the original poster of a review to edit or delete it. here we are using google oauth 

import passport from "passport"; //importing passport to use it for authentication, we will use the Google OAuth strategy for authentication, this will allow users to log in using their Google account, and we can use the user information from their Google profile to identify them in our application and associate their reviews with their account
import "./auth/googleAuth.js";

app.use(passport.initialize());
app.use(passport.session()); //this will initialize passport and allow us to use sessions with passport, this is necessary for the authentication to work properly, it will allow us to store the user information in the session when they log in, and then we can access that information in the request object for any authenticated routes

app.use("/api/v1/reviews", reviews); //using the reviews route for all requests that start with /api/v1/reviews
app.post("/test", (req, res) => {
  res.json({ message: "POST working" });
});

app.get("/auth/google", //defining a route for Google authentication, this route will be used to initiate the authentication process with Google, when a user clicks on the "Sign in with Google" button on the frontend, they will be redirected to this route, which will then redirect them to the Google login page where they can log in with their Google account, after they log in, they will be redirected back to the callback URL defined in the Google OAuth strategy, where we will handle the logic to create or find the user in our database and then log them in
  passport.authenticate("google", { scope: ["profile","email"] }) //this will use the Google OAuth strategy for authentication, and it will request access to the user's profile and email information from their Google account, this is necessary to get the user's name and email address to create or find their account in our database and associate their reviews with their account
);

app.get("/auth/google/callback", //defining a route for the Google authentication callback, this route will be used to handle the callback from Google after the user has authenticated, when a user successfully logs in with their Google account, they will be redirected back to this route, where we will handle the logic to create or find the user in our database and then log them in, if the authentication is successful, we will redirect the user to the index.html page, if there is an error during authentication, we will redirect them back to the home page
  passport.authenticate("google", { failureRedirect: "/" }),
  (req,res)=>{
    res.redirect("http://localhost:5500/index.html");
  }
);

app.get("/logout", (req,res)=>{
    req.logout(()=>{
        res.redirect("http://localhost:5500/index.html");
    });
}); //defining a route for logging out, this route will be used to log the user out of their session, when a user clicks on the "Logout" button on the frontend, they will be redirected to this route, which will then log them out of their session using the logout method provided by passport, and then redirect them back to the home page
app.get("/auth/user", (req,res)=>{
    res.json(req.user || null);
}); //defining a route to get the authenticated user information, this route will be used by the frontend to check if the user is logged in and to get their information, when the frontend makes a GET request to this route, it will return a JSON response with the user information if the user is logged in, or null if the user is not logged in, this will allow the frontend to display the user's name and email address when they are logged in, and also to implement the functionality to allow only the original poster of a review to edit or delete it based on the user's information

app.use((req, res) => res.status(404).json({ error: "Not found" })); //for any request that doesn't match the above route, a 404 error is returned

export default app; //exporting the app to be used in the index.js file where the server is started
