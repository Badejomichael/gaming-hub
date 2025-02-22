import { gameNews } from "../data/games-data.js";
const gameNewsContainer = document.querySelector('.js-game-news-section');

      
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');


let matchingGame;

gameNews.forEach((game) => {
  if (gameId === game.id) {
    matchingGame = game;
  }
});

gameNewsContainer.innerHTML = `
  <div class="container game-news-heading-container">
    <div class="row game-news-heading-row">
      <h1>${matchingGame.name}</h1>
      <p>${matchingGame.publishedDate}</p>
    </div>
  </div>

  <div class="container">
    <div class="row game-news-row">
      <div class="game-news col-lg-6">
      ${matchingGame.fullNews}
      </div>

      <div class="game-image col-lg-6">
      <img src="${matchingGame.image}" class="card-img-top" alt="..."/>
      </div>
    </div>
  </div>


  <div class="container whats-new-container">
    <div class="row">
      <div class="game-image col-lg-6">
      <img src="${matchingGame.gamePlayImage}" class="card-img-top" alt="..."/>
      </div>

      <div class="game-whats-new col-lg-6">
      ${matchingGame.whatsNew}
      </div>
    </div>
  </div>


  <div class="container game-news-conclusion-container">
    <div class="row">
      <p>${matchingGame.conclusion}</p>
    </div>
  </div>

  <div class="container game-news-conclusion-container">
    <div class="row">
      <p class="p1">⭐ <span class="bt">Rating:</span> ${matchingGame.rating}</p>
        <p class="p1">🎮 <span class="bt">Platforms:</span> ${matchingGame.platforms}</p>
        <p class="p1">🎮 <span class="bt">Genre:</span> ${matchingGame.genre}</p>
        <p class="p1">📅 <span class="bt">Release Date:</span> ${matchingGame.releaseDate}</p>
        <a href="#" class="btn btn-outline-light">🔗 Official Game Website</a>
        <a href="./index.html#news-section" class="btn btn-light explore-other-news">Explore Other Trending Game News</a>
    </div>
  </div>

`

document.querySelector('.footer').innerHTML = 
  `
  <footer>
    <div class="footer-row row">
      <div class="footer1-div col-lg-4">
        <div class="footer-brand-name">
          <img class="footer-logo" src="./assests/gaming-logo.jpg" alt="">
          <h3>Mikel's Gaming Hub</h3>
        </div>
        <p class="footer-brand-text">
          Your ultimate destination for the latest game reviews, news, and insights. Stay updated, discover new adventures, and fuel your passion for gaming!" 🎮🔥
        </p>
      </div>

      <div class="footer2-div col-lg-4">
        <a href="./index.html">Home</a>
        <a href="./about.html">About Us</a>
        <a href="./reviews.html">Game Reviews</a>
        <a href="./index.html#news-section">Latest News</a>
        <a href="./index.html#upcoming-games-section">Upcoming Games</a>
      </div>

      <div class="footer3-div col-lg-4">
        <form>
          <h4>Subscribe to our newsletter</h4>
          <p>Stay ahead of the game! Get the latest gaming news, reviews, and updates delivered straight to your inbox.</p>
          <div class="d-flex flex-column flex-sm-row w-100 gap-2">
            <label for="newsletter1" class="visually-hidden">Email address</label>
            <input id="newsletter1" type="text" class="form-control" placeholder="Email address">
            <button class="btn btn-dark subscribe-button type="button">Subscribe</button>
          </div>
        </form>
      </div>
    </div>

    <div class="container">
      <div class="footer-icons">
        <a href="#"><img src="./assests/facebook-icon.svg" alt=""></a>
        <a href="#"><img src="./assests/instagram-icon.svg" alt=""></a>
        <a href="#"><img src="./assests/twitter-icon.svg" alt=""></a>
        <a href="#"><img src="./assests/youtube-icon.svg" alt=""></a>
      </div>
    </div>
  </footer>
    
  `