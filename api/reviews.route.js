import express from 'express';
import ReviewsCtrl from "./reviews.controller.js"; //importing the ReviewsCtrl to use it in the routes for handling the requests related to reviews

const router = express.Router(); //creating a new router object to define the routes for the reviews API

// router.route("/").get(async (req, res) => { //defining a GET route for the root path of the reviews API, this route will be used to get all the reviews for a specific movie
//     res.send("Hello World!"); //for now, this route just sends a simple message as a response, this will be replaced with the actual implementation to get the reviews from the database and send them as a response
// });

router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews); //defining a GET route for the /movie/:id path of the reviews API, this route will be used to get all the reviews for a specific movie, the :id is a route parameter that will be used to identify the movie for which the reviews are being requested, the ReviewsCtrl.apiGetReviews method will be called to handle the request and send the response
router.route("/new").post(ReviewsCtrl.apiPostReview); //defining a POST route for the /new path of the reviews API, this route will be used to add a new review for a movie, the ReviewsCtrl.apiPostReview method will be called to handle the request and send the response
router.route("/:id")
    .get(ReviewsCtrl.apiGetReviewById) //defining a GET route for the /:id path of the reviews API, this route will be used to get a specific review by its ID, the :id is a route parameter that will be used to identify the review for which the details are being requested, the ReviewsCtrl.apiGetReviewById method will be called to handle the request and send the response
    .put(ReviewsCtrl.apiUpdateReview) //defining a PUT route for the /:id path of the reviews API, this route will be used to update a specific review by its ID, the :id is a route parameter that will be used to identify the review that needs to be updated, the ReviewsCtrl.apiUpdateReview method will be called to handle the request and send the response
    .delete(ReviewsCtrl.apiDeleteReview); //defining a DELETE route for the /:id path of the reviews API, this route will be used to delete a specific review by its ID, the :id is a route parameter that will be used to identify the review that needs to be deleted, the ReviewsCtrl.apiDeleteReview method will be called to handle the request and send the response

//:id is like a variable, we can put in any value in place of it and it will be a different route
// so overall if wee go to the /:id path of the reviews API with a GET request, we will get the details of a specific review, if we go to the same path with a PUT request, we will update the review, and if we go to the same path with a DELETE request, we will delete the review

export default router; //exporting the router to be used in the server.js file where it is imported and used for the /api/v1/reviews route