const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f2befddb4189eaf1a665306d4087af31&page=1';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'; //root path to every image of movies
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=f2befddb4189eaf1a665306d4087af31&query=';

const main = document.getElementById('section');
const form = document.getElementById('form');
const search = document.getElementById('query');

fetch("http://localhost:8000/auth/user", {
  credentials: "include"
})
.then(res => res.json())
.then(user => {

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if(user){
      loginBtn.style.display = "none";
  } else {
      logoutBtn.style.display = "none";
  }

});


returnMovies(APILINK); //loads the most popular movies when the page is opened for the first time

function returnMovies(url){
    fetch(url)
    .then(res => res.json())
    .then(function(data){
        console.log("Total movies received:", data.results.length);
        console.log(data.results);
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');
        data.results.forEach(element => {
            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'card');


            // const div_column = document.createElement('div');
            // div_column.setAttribute('class', 'column');
            // div_column.setAttribute('id', 'movie-list');

            const image = document.createElement('img');
            image.setAttribute('class', 'thumbnail');
            image.setAttribute('id', 'image');

            const title = document.createElement('h3');
            title.setAttribute('id', 'title'); //attributes are set so that they can be styled using CSS

            const center = document.createElement('center');

            title.innerHTML = `${element.title} <br> <a href="movie.html?id=${element.id}&title=${element.title}">Reviews</a>`; //the title of the movie is displayed along with a link to view the reviews for that movie, the link will take the user to the movie.html page where the reviews for that movie will be displayed
            image.src = IMG_PATH + element.poster_path;

            center.appendChild(image);
            div_card.appendChild(center);
            div_card.appendChild(title);
            // div_column.appendChild(div_card);
            div_row.appendChild(div_card);
            main.appendChild(div_row);
        });
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    main.innerHTML = '';

    const searchItem = search.value;

    if (searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        search.value = ''; //when smth is searched, the search bar is cleared after showing the result
    }
})