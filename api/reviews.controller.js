import ReviewsDAO from "../dao/reviewsDAO.js"; //importing the ReviewsDAO to use its methods for database operations related to reviews
//two dots are used to go back to the parent directory and then access the dao directory and then the reviewsDAO.js file

export default class ReviewsController { //defining the ReviewsController class that will contain the methods to handle the requests related to reviews, these methods will be called in the routes defined in the reviews.route.js file
    static async apiPostReviews(req, res, next) { //defining a static method to handle the GET request for getting all the reviews for a specific movie, this method will be called in the /movie/:id route defined in the reviews.route.js file
    try{
        const movieId = parseInt(req.body.movieId); //getting the movie_id from the request body, this will be used to identify the movie for which the reviews are being added
        const review = req.body.review; //getting the review text from the request body, this will be the actual review that is being added for the movie
        const user = req.user.email; //getting the user name from the request body, this will be used to identify the user who is adding the review, this information is obtained from the authenticated user object that is stored in the session by passport after the user logs in with Google OAuth, this will allow us to associate the review with the user's account and also to implement the functionality to allow only the original poster of a review to edit or delete it

        const reviewResponse = await ReviewsDAO.addReview( //calling the addReview method of the ReviewsDAO to add the review to the database, this method will return a response that contains the status of the operation and any error message if there is an error
            movieId,
            review,
            user
        );
        res.json({status:"success"}); //sending a JSON response with the status of the operation, this will be sent back to the frontend to indicate that the review has been added successfully
    }catch(e){
        res.status(500).json({error: e.message}); //if there is an error, a JSON response with the error message is sent back to the frontend, this will indicate that there was an error while adding the review
    };
    };
    static async apiGetReview(req, res, next) { //defining a static method to handle the GET request for getting all the reviews for a specific movie, this method will be called in the /movie/:id route defined in the reviews.route.js file
        try{
            let id = req.params.id || {}; //getting the movie_id from the route parameters, this will be used to identify the movie for which the reviews are being requested
            let review = await ReviewsDAO.getReview(id); //calling the getReviews method of the ReviewsDAO to get all the reviews for the specified movie from the database, this method will return an array of reviews
            if (!review) { //if there are no reviews for the specified movie, a JSON response with an error message is sent back to the frontend, this will indicate that there are no reviews for the movie
                res.status(404).json({error: "Not found"});
                return;
            }
            res.json(review); //if there are reviews for the specified movie, a JSON response with the reviews is sent back to the frontend, this will be an array of reviews that can be displayed on the frontend

        } catch(e){
            console.log(`api, ${e}`); //logging the error to the console for debugging purposes, this will help in identifying the issue if there is an error while getting the reviews
            res.status(500).json({error: e.message}); //if there is an error, a JSON response with the error message is sent back to the frontend, this will indicate that there was an error while getting the reviews
        }
    };
    static async apiUpdateReview(req, res, next) { //defining a static method to handle the PUT request for updating a specific review by its ID, this method will be called in the /:id route defined in the reviews.route.js file
        try{
            const reviewId = req.params.id; //getting the review ID from the route parameters, this will be used to identify the review that needs to be updated
            const review = req.body.review; //getting the updated review text from the request body, this will be the new review text that will replace the old review text in the database
            const user = req.user.email; //getting the user name from the request body, this will be used to identify the user who is updating the review

            const reviewResponse = await ReviewsDAO.updateReview( //calling the updateReview method of the ReviewsDAO to update the review in the database, this method will return a response that contains the status of the operation and any error message if there is an error
                reviewId,   
                user,
                review
            );
            var {error} = reviewResponse; //destructuring the error from the reviewResponse, this will be used to check if there was an error while updating the review
            if (error) { //if there was an error while updating the review, a JSON response with the error message is sent back to the frontend, this will indicate that there was an error while updating the review  
                res.status(400).json({error});
            }
            if (reviewResponse.modifiedCount === 0) { //if the modifiedCount is 0, it means that the review was not updated, this can happen if the review ID is incorrect or if the user is trying to update a review that they did not create, in this case, a JSON response with an error message is sent back to the frontend, this will indicate that the review was not updated
                throw new Error("Unable to update review - user may not be original poster");
            }
            res.json({status: "success"}); //if the review was updated successfully, a JSON response with the status of the operation is sent back to the frontend, this will indicate that the review has been updated successfully
        } catch(e){
            res.status(500).json({error: e.message}); //if there is an error, a JSON response with the error message is sent back to the frontend, this will indicate that there was an error while updating the review
        }};

        static async apiDeleteReview(req, res, next) { //defining a static method to handle the DELETE request for deleting a specific review by its ID, this method will be called in the /:id route defined in the reviews.route.js file
            try{
                const reviewId = req.params.id; //getting the review ID from the route parameters, this will be used to identify the review that needs to be deleted
                const user = req.user.email; //getting the user email from the authenticated user object that is stored in the session by passport after the user logs in with Google OAuth, this will allow us to associate the review with the user's account and also to implement the functionality to allow only the original poster of a review to delete it
            const reviewResponse = await ReviewsDAO.deleteReview( //calling the deleteReview method of the ReviewsDAO to delete the review from the database, this method will return a response that contains the status of the operation and any error message if there is an error
                reviewId,
                user
            );
            res.json({status: "success"}); //if the review was deleted successfully, a JSON response with the status of the operation is sent back to the frontend, this will indicate that the review has been deleted successfully
            } catch(e){
                res.status(500).json({error: e.message}); //if there is an error, a JSON response with the error message is sent back to the frontend, this will indicate that there was an error while deleting the review
            }}
        static async apiGetReviews(req, res, next) { //defining a static method to handle the GET request for getting all the reviews for a specific movie, this method will be called in the /movie/:id route defined in the reviews.route.js file
            try{
                let id = req.params.id || {}; //getting the movie_id from the route parameters, this will be used to identify the movie for which the reviews are being requested
                let reviews = await ReviewsDAO.getReviewsByMovieId(id); //calling the getReviews method of the ReviewsDAO to get all the reviews for the specified movie from the database, this method will return an array of reviews
                if (!reviews) { //if there are no reviews for the specified movie, a JSON response with an error message is sent back to the frontend, this will indicate that there are no reviews for the movie
                    res.status(404).json({error: "Not found"});
                    return;
                }
                res.json(reviews); //if there are reviews for the specified movie, a JSON response with the reviews is sent back to the frontend, this will be an array of reviews that can be displayed on the frontend
            }catch(e){
                console.log(`api, ${e}`); //logging the error to the console for debugging purposes, this will help in identifying the issue if there is an error while getting the reviews
                res.status(500).json({error: e.message}); //if there is an error, a JSON response with the error message is sent back to the frontend, this will indicate that there was an error while getting the reviews
            }};
};