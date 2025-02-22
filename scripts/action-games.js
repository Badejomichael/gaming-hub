import { actionGameNews } from "../data/games-data.js";

const apiKey = '55d51ca43af04d0b93df26dcad8f1205';

// rpg game

// Function to fetch and store category data
async function getActionGames() {
  // Check localStorage first
  const actionGames = localStorage.getItem("action-games");
  if (actionGames) {
      displayGames(JSON.parse(actionGames));
      console.log(JSON.parse(actionGames));
      console.log("Loaded from localStorage");
      return;
  }

  else {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?genres=action&page_size=100&ordering=-added&key=${apiKey}`);
      const data = await response.json();

      // const validGames = data.results.filter(game => game.background_image && game.ratings_count > 0);

      // Save to localStorage
      localStorage.setItem("action-games", JSON.stringify(data.results));

      // Display on page
      displayGames(data.results);
      console.log("Fetched from API and saved to localStorage");

    } catch (error) {
          console.error("Error fetching categories:", error);
    }
  }
} 

// Function to display categories
function displayGames(games) {
  let actionGames = '';
  // Clear previous content

  games.forEach(game => {
      actionGames += `
        <div class="card" style="width: 20rem">
          <img src="${game.background_image}" class="card-img-top" alt="..." height="150px"/>
          <div class="card-body">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text">
              A highly rated Action with immersive gameplay and great storytelling.
            </p>
          </div>

          <a href="https://rawg.io/games/${game.slug}" target="_blank" class="btn btn-outline-light">🔗 Read More...</a>
        </div>
      `
  });

  document.querySelector('.js-action-games-row').innerHTML = actionGames;
}




// featured rpg game of the week

async function getRandomActionGame() {
  // Check localStorage first to avoid excessive API calls
  const cachedActionGame = localStorage.getItem("featuredActionGame");
  if (cachedActionGame) {
    displayFeaturedGame(JSON.parse(cachedActionGame));
      console.log("Loaded from localStorage");
      return;
  }

  else {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?genres=action&page_size=100&ordering=-added&key=${apiKey}`);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.error("No games found!");
        return;
    }
      // Pick a random game
      const randomGame = data.results[3];

      console.log(randomGame)
      // Construct game object
      const featuredActionGame = {
          name: randomGame.name,
          rating: randomGame.rating || "N/A",
          description: randomGame.description_raw || '', // RAWG API doesn't have short descriptions
          image: randomGame.background_image || "https://via.placeholder.com/300",
          release_date: randomGame.released || "Unknown",
          platforms: randomGame.platforms ? randomGame.platforms.map(p => p.platform.name).join(", ") : "N/A",
          metacritic: randomGame.metacritic || "N/A",
          website: randomGame.website || "#"

      };
      // Save to localStorage
      localStorage.setItem("featuredActionGame", JSON.stringify(featuredActionGame));

      // Display the game
      displayFeaturedGame(featuredActionGame);
      console.log("Fetched from API and saved to localStorage");
      console.log(featuredActionGame)
  } catch (error) {
      console.error("Error fetching game data:", error);
  }
  }
}

// Function to display the game on the webpage
function displayFeaturedGame(game) {
  document.querySelector('.js-featured-game-row').innerHTML =
  `
  <div class="game-info col-lg-6">
    <h3 class="featured-game-hero-text">${game.name}</h3>
    <p>${game.description}</p>
    <p>⭐ <span class="bt">Rating:</span> 4.26</p>
    <p>🎮 <span class="bt">Platforms:</span> ${game.platforms}</p>
    <p>📅 <span class="bt">Release Date:</span> ${game.release_date}</p>
    <p>🏆 <span class="bt">Metacritic Score:</span> ${game.metacritic}</p>
    <a href="${game.website}" class="btn btn-outline-light">🔗 Official Website</a>
  </div>

  <div class="game-image col-lg-6">
  <img src="${game.image}" class="card-img-top" alt="..."/>
  </div>
  `
}



// latest rpgGameNews
function displayLatestActionGamesNews() {
  let newsHTML = '';

  actionGameNews.forEach((news) => {
    newsHTML+=
    `
      <div class="row latest-news-row js-latest-news-row">

          <div class="game-info col-lg-6">
            <h3 class="featured-game-hero-text">${news.name}</h3>
            <p class="fp">${news.publishedDate}</p>
            <p class="lp">${news.briefNews}</p>
          </div>

          <div class="game-image col-lg-6">
            <img src="${news.image}" class="card-img-top" alt="..."/>
          </div>

        </div>
    `
  });

document.querySelector('.js-latest-news-container').innerHTML = newsHTML;
}




document.addEventListener("DOMContentLoaded",  () => {
  getActionGames();
  getRandomActionGame();
  displayLatestActionGamesNews();
});









// search bar
const searchInput = document.querySelector(".search-input");
const searchResultsDiv = document.querySelector(".js-search-result-row");
let searchResultHTML = '';

async function searchGames(query) {
  document.querySelector('.js-search-result-header').classList.remove('positive-result-header');
  searchResultsDiv.innerHTML = `<p class="searching-text">Searching...</p>`;
  const newSearchInput = searchInput.value.toLowerCase();

  let storedActionGames = JSON.parse(localStorage.getItem("action-games"));

  let filteredActionGames = storedActionGames.filter(game =>
    game.name.toLowerCase().includes(newSearchInput)
  );

  if (filteredActionGames.length > 0) {
    document.querySelector('.js-search-result-header').classList.add('positive-result-header');
    displaySearchResults(filteredActionGames);
    // document.querySelector('.js-search-result').classList.add('displayborder');
    document.querySelector('.games-section').classList.add('remove-games-section');
    
    if (!query.value) {
      document.querySelector('.js-search-result-header').classList.remove('positive-result-header');
      document.querySelector('.games-section').classList.remove('remove-games-section');
      searchResultsDiv.innerHTML = `<h3 class="error">Invalid Search.</h3>`;
      console.log('error')
    }
  }

  // If no matches in localStorage, fetch from Rawg API
  else {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query.value)}&genres=action&page_size=20`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const searchedGame = data.results.filter(game => 
          game.genres && game.genres.some(genre => genre.name.toLowerCase() === "action")
        )
        
        document.querySelector('.js-search-result-header').classList.add('positive-result-header');
        displaySearchResults(searchedGame);
        document.querySelector('.js-search-result').classList.add('displayborder');
        return;
      } else {
        searchResultsDiv.innerHTML = `<h3 class="error">Error fetching games. Try again later.</h3>`;
        document.querySelector('.js-search-result').classList.remove('displayborder');
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    //document.querySelector('.js-search-result').classList.add('displayborder');
    document.querySelector('.games-section').classList.remove('remove-games-section');
    searchResultsDiv.innerHTML = `<h3 class="error">Error fetching games. Try again later.</h3>`;
    document.querySelector('.js-search-result').classList.remove('displayborder');
    }
  }
}





function displaySearchResults(games) {
  searchResultHTML = " ";
  games.forEach(game => {
    searchResultHTML+= `
      <div class="card" style="width: 20rem">
        <img src="${game.background_image}" class="card-img-top" alt="..." height="150px"/>
        <div class="card-body">
          <h5 class="card-title">${game.name}</h5>
          <p class="card-text">
            A highly rated Action with immersive gameplay and great storytelling.
          </p>
        </div>

        <a href="https://rawg.io/games/${game.slug}" target="_blank" class="btn btn-outline-light">🔗 Read More...</a>
      </div>
    `;
  });

  searchResultsDiv.innerHTML = searchResultHTML;
}


document.querySelector('.js-search-form-btn')
  .addEventListener('click', () => {
    searchGames(searchInput);
});



// functionality for seraching with special keys
document.querySelector('.search-input')
.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchGames(searchInput);
  } else if (event.key === 'Return') {
    searchGames(searchInput);
  } 
});