import dotenv from 'dotenv';
dotenv.config();

import mongodb from 'mongodb';
import app from './server.js';
import ReviewsDAO from './dao/reviewsDAO.js'; //importing the ReviewsDAO to initialize the database connection before starting the server(data access object for reviews)
console.log("Running from:", process.cwd());

const MongoClient = mongodb.MongoClient;

const mongo_username = process.env.db_user;
const mongo_password = process.env.db_password;
const port = process.env.PORT;
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.pkby0g8.mongodb.net/?appName=Cluster0` 


MongoClient.connect(

    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        // useNewUrlParser: true //not needed in new versions
    } //connecting to the MongoDB database using the connection string and options, these options are mostly fixed and can be used as is for any MongoDB connection
)
.catch(err => {
    console.error(err.stack); //.stack is given to access the stack trace of the error object, which provides more information about where the error occurred in the code
    process.exit(1); //if there is an error connecting to the database, the error is logged and the process is exited with a non-zero code to indicate failure
})
.then(async client => { //async is used here because we need to wait for the database connection to be established before starting the server and initializing the ReviewsDAO, this ensures that the database connection is available for any requests that are handled by the server
    await ReviewsDAO.injectDB(client); //injecting the database connection into the ReviewsDAO, this allows the ReviewsDAO to use the database connection for any database operations related to reviews, this is done before starting the server to ensure that the database connection is established and available for any requests that are handled by the server
    app.listen(port, () => { //.listen is used to start the server and listen for incoming requests on the specified port
        console.log(`Server is running on port: ${port}`);
    }); //if the connection is successful, the server is started and listens on the specified port, a message is logged to indicate that the server is running

     //the database connection is injected into the ReviewsDAO to be used for database operations related to reviews, this is done after the server is started to ensure that the database connection is established before any requests are handled
});