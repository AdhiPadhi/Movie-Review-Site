//we will connect to mongodb here

import mongodb from 'mongodb';

const ObjectID = mongodb.ObjectId; //to work with MongoDB ObjectIDs, which are used as unique identifiers for documents in MongoDB collections
let reviews; //this variable will hold the reference to the reviews collection in the MongoDB database, it is initialized as undefined and will be set to the actual collection reference when the database connection is established

export default class ReviewsDAO { //defining a class for the Reviews Data Access Object (DAO), this class will contain static methods for performing database operations related to reviews, such as adding a review, getting reviews, updating a review, and deleting a review
    static async injectDB(conn) { //defining a static method to inject the database connection into the ReviewsDAO, this method will be called in the index.js file after the database connection is established, it takes the database connection as a parameter and sets the reviews variable to the reference of the reviews collection in the MongoDB database
        if (reviews) { //if the reviews variable is already set, it means that the database connection has already been injected, so we can return early to avoid re-injecting the database connection
            return;
        }
        try {
            reviews = await conn.db("reviews").collection("reviews"); //setting the reviews variable to the reference of the reviews collection in the MongoDB database, this is done by accessing the database using the connection object and then accessing the reviews collection within that database(database can have many things inside, were gonna access the reviews collection which is where we will store all the reviews for the movies)
        } catch (e) {
            console.error(`Unable to establish a collection reference in ReviewsDAO: ${e}`); //if there is an error while setting up the collection reference, an error message is logged to the console for debugging purposes
        }}

    static async addReview(movieId, review, user) { //defining a static method to add a review for a movie, this method will be called in the apiPostReview method of the ReviewsController class, it takes the movie ID, review text, and user name as parameters and adds a new review document to the reviews collection in the MongoDB database
        try {
            const reviewDoc = { //creating a review document that will be inserted into the reviews collection, this document contains the movie ID, review text, user name, and the date when the review was added
                movie_id: movieId,
                user: user,
                review: review,
        }
        return await reviews.insertOne(reviewDoc); //inserting the review document into the reviews collection and returning the result of the insertion operation, this will con tain information about the inserted document, such as the inserted ID
    } catch (e) {
        console.error(`Unable to post review: ${e}`);
        return { error: e }; //if there is an error while adding the review, an error message is logged to the console for debugging purposes and an object with the error is returned, this will be used in the apiPostReview method to send an appropriate response back to the frontend
    }};

    static async getReview(reviewId) { //defining a static method to get all the reviews for a specific movie, this method will be called in the apiGetReview method of the ReviewsController class, it takes the movie ID as a parameter and retrieves all the review documents for that movie from the reviews collection in the MongoDB database
        try {
            return await reviews.findOne({ _id :new ObjectID(reviewId) }); //retrieving a single review document from the reviews collection that matches the specified review ID, this is done using the findOne method and passing a query object that matches the _id field with the ObjectID created from the reviewId parameter, this will return the review document if it exists or null if it does not exist (new mustt be put here because we need to create a new ObjectID from the reviewId string, this is necessary because the _id field in MongoDB is of type ObjectID and we need to convert the reviewId string to an ObjectID to perform the query)
        } catch (e) {
            console.error(`Unable to get review: ${e}`);
            // return { error: e };
            throw e; //if there is an error while getting the review, an error message is logged to the console for debugging purposes and an object with the error is returned, this will be used in the apiGetReview method to send an appropriate response back to the frontend
        }
    };
    static async updateReview(reviewId, user, review) { //defining a static method to update a specific review by its ID, this method will be called in the apiUpdateReview method of the ReviewsController class, it takes the review ID, user name, and updated review text as parameters and updates the corresponding review document in the reviews collection in the MongoDB database
        try{
            const updateResponse = await reviews.updateOne( //updating a single review document in the reviews collection that matches the specified review ID and user name, this is done using the updateOne method and passing a query object that matches the _id field with the ObjectID created from the reviewId parameter and the user field with the user parameter, this ensures that only the original poster of the review can update it, the second parameter is an update operator that sets the review field to the new review text, this will return an object that contains information about the update operation, such as the number of documents matched and modified
                { _id: new ObjectID(reviewId)},
                { $set: { user:user, review: review } }
            );
            return updateResponse; //returning the result of the update operation, this will be used in the apiUpdateReview method to send an appropriate response back to the frontend based on whether the update was successful or if there was an error
        }
        catch(e){  
            console.error(`Unable to update review: ${e}`);
            return { error: e }; //if there is an error while updating the review, an error message is logged to the console for debugging purposes and an object with the error is returned, this will be used in the apiUpdateReview method to send an appropriate response back to the frontend
        };};
    static async deleteReview(reviewId) { //defining a static method to delete a specific review by its ID, this method will be called in the apiDeleteReview method of the ReviewsController class, it takes the review ID and user name as parameters and deletes the corresponding review document from the reviews collection in the MongoDB database
        try {
            const deleteResponse = await reviews.deleteOne({ _id: new ObjectID(reviewId) });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    };
    // static async getReview(reviewId) { //defining a static method to get a specific review by its ID, this method will be called in the apiGetReview method of the ReviewsController class, it takes the review ID as a parameter and retrieves the corresponding review document from the reviews collection in the MongoDB database
    //     try {
    //         const review = await reviews.findOne({ _id: ObjectID(reviewId) });
    //         return review;
    //     } catch (e) {
    //         console.error(`Unable to get review: ${e}`);
    //         return { error: e }; 
    //     }
    // };
    static async getReviewsByMovieId(movieId) { //defining a static method to get all the reviews for a specific movie, this method will be called in the apiGetReview method of the ReviewsController class, it takes the movie ID as a parameter and retrieves all the review documents for that movie from the reviews collection in the MongoDB database
        try {
            const cursor = await reviews.find({ movie_id: parseInt(movieId) }); //retrieving all the review documents from the reviews collection that match the specified movie ID, this is done using the find method and passing a query object that matches the movie_id field with the movieId parameter, this will return a cursor that can be used to iterate over the matching review documents (parseint converts the movie id from string to integer)
            return cursor.toArray(); //converting the cursor to an array of review documents and returning it
        } catch (e) {
            console.error(`Unable to get reviews: ${e}`);
            return { error: e }; //if there is an error while getting the reviews, an error message is logged to the console for debugging purposes and an object with the error is returned, this will be used in the apiGetReviewsByMovieId method to send an appropriate response back to the frontend
        }};
    };