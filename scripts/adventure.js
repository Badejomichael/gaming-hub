import { adventureGameNews } from "../data/games-data.js";

const apiKey = '55d51ca43af04d0b93df26dcad8f1205';

// shooter game

// Function to fetch and store category data
async function getAdventureGames() {
  // Check localStorage first
  const adventureGames = localStorage.getItem("adventure-games");
  if (adventureGames) {
      displayGames(JSON.parse(adventureGames));
      console.log(JSON.parse(adventureGames));
      console.log("Loaded from localStorage");
      return;
  }

  else {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?genres=adventure&page_size=100&ordering=-added&key=${apiKey}`);
      const data = await response.json();

      // const validGames = data.results.filter(game => game.background_image && game.ratings_count > 0);

      // Save to localStorage
      localStorage.setItem("adventure-games", JSON.stringify(data.results));

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
  let adventureGames = '';
  // Clear previous content

  games.forEach(game => {
    adventureGames += `
        <div class="card" style="width: 20rem">
          <img src="${game.background_image}" class="card-img-top" alt="..." height="150px"/>
          <div class="card-body">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text">
              A highly rated adventure game with immersive gameplay and great storytelling.
            </p>
          </div>

          <a href="https://rawg.io/games/${game.slug}" target="_blank" class="btn btn-outline-light">🔗 Read More...</a>
        </div>
      `
  });

  document.querySelector('.js-adventure-games-row').innerHTML = adventureGames;
}




// featured adventure game of the week

async function getRandomAdventureGame() {
  // Check localStorage first to avoid excessive API calls
  const cachedAdventureGame = localStorage.getItem("featuredAdventureGame");
  if (cachedAdventureGame) {
    displayFeaturedGame(JSON.parse(cachedAdventureGame));
      console.log("Loaded from localStorage");
      return;
  }

  else {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?genres=adventure&page_size=100&ordering=-added&key=${apiKey}`);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.error("No games found!");
        return;
    }
      // Pick a random game
      const randomGame = data.results[Math.floor(Math.random() * data.results.length)];

      console.log(randomGame)
      // Construct game object
      const featuredAdventureGame = {
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
      localStorage.setItem("featuredAdventureGame", JSON.stringify(featuredAdventureGame));

      // Display the game
      displayFeaturedGame(featuredAdventureGame);
      console.log("Fetched from API and saved to localStorage");
      console.log(featuredAdventureGame)
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



// latest adventureGameNews
function displayLatestAdventureGamesNews() {
  let newsHTML = '';

  adventureGameNews.forEach((news) => {
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
  getAdventureGames()
  getRandomAdventureGame();
  displayLatestAdventureGamesNews()
});



// search bar
const searchInput = document.querySelector(".search-input");
const searchResultsDiv = document.querySelector(".js-search-result-row");
let searchResultHTML = '';

async function searchGames(query) {
  document.querySelector('.js-search-result-header').classList.remove('positive-result-header');
  searchResultsDiv.innerHTML = `<p class="searching-text">Searching...</p>`;
  const newSearchInput = searchInput.value.toLowerCase();

  let storedAdventureGames = JSON.parse(localStorage.getItem("adventure-games"));

  let filteredAdventureGames = storedAdventureGames.filter(game =>
    game.name.toLowerCase().includes(newSearchInput)
  );

  if (filteredAdventureGames.length > 0) {
    document.querySelector('.js-search-result-header').classList.add('positive-result-header');
    displaySearchResults(filteredAdventureGames);
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
        `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query.value)}&genres=adventure&page_size=20`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const searchedGame = data.results.filter(game => 
          game.genres && game.genres.some(genre => genre.name.toLowerCase() === "adventure")
        )
        
        document.querySelector('.js-search-result-header').classList.add('positive-result-header');
        displaySearchResults(searchedGame);
        document.querySelector('.js-search-result').classList.remove('displayborder');
        document.querySelector('.games-section').classList.add('remove-games-section');
        return;
      } else {
        searchResultsDiv.innerHTML = `<h3 class="error">No Games Found.</h3>`;
        document.querySelector('.games-section').classList.remove('remove-games-section');
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
            A highly rated adventure game with immersive gameplay and great storytelling.
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