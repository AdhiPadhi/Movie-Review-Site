import express from 'express';
import cors from 'cors'; //for cross-origin requests
import reviews from "./api/reviews.route.js"; //importing the reviews route to use it in the server

const app = express();

app.use(cors()); //to allow cross-origin requests from the frontend to the backend
app.use(express.json()); //to parse the incoming JSON data in the request body

app.use("/api/v1/reviews", reviews); //using the reviews route for all requests that start with /api/v1/reviews

app.use((req, res) => res.status(404).json({ error: "Not found" })); //for any request that doesn't match the above route, a 404 error is returned

export default app; //exporting the app to be used in the index.js file where the server is started
