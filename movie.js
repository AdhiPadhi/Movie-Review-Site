const url = new URL(location.href); //creating a new URL object from the current window location, this allows us to easily access the query parameters in the URL
const movieId = url.searchParams.get("id"); //getting the value of the "id" query parameter from the URL, this will be used to identify the movie for which the reviews are being requested
const movieTitle = url.searchParams.get("title"); //getting the value of the "title" query parameter from the URL, this will be used to display the title of the movie on the movie.html page

const APILINK = 'http://localhost:8000/api/v1/reviews/';


const main = document.getElementById('section');
const title = document.getElementById('title');

title.innerHTML = movieTitle; //setting the inner HTML of the title element to the movie title obtained from the URL query parameters, this will display the title of the movie on the movie.html page
div_new = document.createElement('div');
div_new.innerHTML = `
<div class="row">
    <div class="column">
        <div class="card">
            New Review
            <p><strong>Review : </strong><input type="text" id="new_review"></p>
            <p><strong>User : </strong><input type="text" id="new_user"></p>
            <p><a href="#" onclick="saveReview('new_review', 'new_user')">💾</a></p>
        </div>
    </div>
</div>`; //creating a new review card with input fields for the review text and user name, along with a submit button to add the new review, the submit button will call the saveReview function with the IDs of the input fields as parameters
main.appendChild(div_new); //appending the new review card to the main section of the page so that it is displayed on the movie.html page

if (movieId) {
    returnReviews(APILINK);
} //loads the most popular movies when the page is opened for the first time

function returnReviews(url){
    main.innerHTML = "";
    main.appendChild(div_new); //appending the new review card to the main section of the page so that it is displayed on the movie.html page, this is done here to ensure that the new review card is always displayed at the top of the reviews list, even after the reviews are reloaded when a review is added, updated, or deleted
    fetch(url + "movie/" + movieId) //fetching the reviews for the specific movie from the backend API, the URL is constructed by appending the movie ID to the base API URL, this will make a GET request to the /api/v1/reviews/movie/:id endpoint defined in the reviews.route.js file, where :id is replaced with the actual movie ID obtained from the URL query parameters
    .then(res => res.json())
    .then(function(data){
        console.log(data);
        
        data.forEach(review => {
            const div_card = document.createElement('div');
            div_card.setAttribute('id', 'rev_cards');
            div_card.innerHTML = `
            <div class="row">
                <div class="column">
                    <div class="card" id=${review._id}>
                        <p><strong>Review : </strong>${review.review}</p>
                        <p><strong>User : </strong>${review.user}</p>
                        <p><a href="#" onclick="editReview('${review._id}', '${review.user}', '${review.review}')">✏️</a> <a href="#" onclick="deleteReview('${review._id}')">🗑️</a></p>
                    </div>
                </div>
            </div>
            `; //setting the inner HTML of the review card to display the review text and user name, along with edit and delete buttons for each review, the edit button will call the editReview function with the review ID, user name, and review text as parameters, and the delete button will call the deleteReview function with the review ID as a parameter


            main.appendChild(div_card);
        });
    });
}

function editReview(id, user, review) { //defining a function to handle the edit review action, this function will be called when the edit button for a review is clicked, it takes the review ID, user name, and review text as parameters and allows the user to edit the review
    console.log(review);
    const element = document.getElementById(id); //getting the review card element by its ID, this will be used to replace the review text with an editable form
    console.log(element);
    const reviewInputId = "review" + id; //creating a unique ID for the review input field by concatenating the string "review" with the review ID, this will be used to identify the input field for the review text when the form is submitted
    const userInputId = "user" + id; //creating a unique ID for the user input field by concatenating the string "user" with the review ID, this will be used to identify the input field for the user name when the form is submitted  

    element.innerHTML = `
    <p><strong>Review : </strong><input type="text" id="${reviewInputId}" value="${review}"></p>
    <p><strong>User : </strong><input type="text" id="${userInputId}" value="${user}"></p>
    <p>
    <a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">💾</a> 
    <a href="#" onclick="returnReviews(APILINK + 'movie/' + movieId)">❌</a>
    </p>
    `; //setting the inner HTML of the review card to display input fields for editing the review text and user name, along with submit and cancel buttons, the submit button will call the saveReview function with the review ID and the IDs of the input fields as parameters, and the cancel button will call the returnReviews function to reload the reviews without making any changes   
};

function saveReview(reviewInputId, userInputId, id="") { //defining a function to handle the save review action, this function will be called when the submit button for editing a review is clicked, it takes the IDs of the review input field, user input field, and review ID as parameters and saves the updated review to the database
    console.log("Updating ID:", id);
    const review = document.getElementById(reviewInputId).value; //getting the updated review text from the input field using its ID, this will be the new review text that will replace the old review text in the database
    const user = document.getElementById(userInputId).value; //getting the updated user name from the input field using its ID, this will be the new user name that will replace the old user name in the database
    if (id) { //if the review ID is provided, it means that we are updating an existing review, so a PUT request will be made to the backend API to update the review in the database
        fetch(APILINK + id, { //making a PUT request to the backend API to update the review in the database, the URL is constructed by appending the review ID to the base API URL, this will make a PUT request to the /api/v1/reviews/:id endpoint defined in the reviews.route.js file, where :id is replaced with the actual review ID)
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": user,  "review": review }) //the request body contains the updated review text and user name in JSON format, this will be sent to the backend API to update the review in the database
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload(); //reloading the page to reflect the updated review, this will make a new GET request to the backend API to fetch the updated reviews and display them on the page
        });
    }
    else{ //if the review ID is not provided, it means that we are adding a new review, so a POST request will be made to the backend API to add the new review to the database
        fetch(APILINK + "new", { //making a POST request to the backend API to add the new review to the database, this will make a POST request to the /api/v1/reviews/new endpoint defined in the reviews.route.js file
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": user, "review": review, "movieId": movieId }) //the request body contains the movie ID, review text, and user name in JSON format, this will be sent to the backend API to add the new review to the database
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload(); //reloading the page to reflect the new review, this will make a new GET request to the backend API to fetch the updated reviews and display them on the page
        });
    };
};

function deleteReview(id) { //defining a function to handle the delete review action, this function will be called when the delete button for a review is clicked, it takes the review ID as a parameter and deletes the review from the database
    fetch(APILINK + id, { //making a DELETE request to the backend API to delete the review from the database, the URL is constructed by appending the review ID to the base API URL, this will make a DELETE request to the /api/v1/reviews/:id endpoint defined in the reviews.route.js file, where :id is replaced with the actual review ID
        method: 'DELETE'
    }).then(res => res.json())
    .then(res => {
        console.log(res);
        location.reload(); //reloading the page to reflect the deleted review, this will make a new GET request to the backend API to fetch the updated reviews and display them on the page
    });
};