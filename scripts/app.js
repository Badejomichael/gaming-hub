import { gameNews } from "../data/games-data.js";
const apiKey = '55d51ca43af04d0b93df26dcad8f1205'
const API_URL = `https://api.rawg.io/api/games?key=${apiKey}&page_size=50`;



// featured game of the week section

async function getRandomGame() {
    // Check localStorage first to avoid excessive API calls
    const cachedGame = localStorage.getItem("featuredGame");
    if (cachedGame) {
        displayGame(JSON.parse(cachedGame));
        console.log("Loaded from localStorage");
        return;
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            console.error("No games found!");
            return;
        }

        // Pick a random game
        const randomGame = data.results[Math.floor(Math.random() * data.results.length)];

        console.log(randomGame)
        // Construct game object
        const featuredGame = {
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
        localStorage.setItem("featuredGame", JSON.stringify(featuredGame));

        // Display the game
        displayGame(featuredGame);
        console.log("Fetched from API and saved to localStorage");
        console.log(randomGame)
    } catch (error) {
        console.error("Error fetching game data:", error);
    }
}

// Function to display the game on the webpage
function displayGame(game) {
    document.querySelector('.js-featured-game-row').innerHTML =
    `
    <div class="game-info col-lg-6">
      <h3 class="featured-game-hero-text">${game.name}</h3>
      <p>${game.description}</p>
      <p>⭐ <span class="bt">Rating:</span> ${game.rating}</p>
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





// games categories section

const categories = [
  { slug: "action", name: "Action", description: "Fast-paced games full of combat and excitement."},
  { slug: "role-playing-games-rpg", name: "RPG", description: "Deep story-driven games with character progression." },
  { slug: "shooter", name: "Shooter", description: "First-person and third-person shooting games." },
  { slug: "adventure", name: "Adventure", description: "Exploration-focused games with immersive storytelling." },
  { slug: "sports", name: "Sports & Racing", description: "Realistic sports and high-speed racing games." }
];

// Function to fetch and store category data
async function getCategories() {
  // Check localStorage first
  const cachedCategories = localStorage.getItem("gameCategories");
  if (cachedCategories) {
      displayCategories(JSON.parse(cachedCategories));
      console.log("Loaded from localStorage");
      return;
  }

  try {
      const categoryData = [];

      for (const category of categories) {
          const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&genres=${category.slug}&page_size=1`);
          const data = await response.json();

          if (data.results.length > 0) {
              const game = data.results[0]; // Get first game in the category

              categoryData.push({
                  name: category.name,
                  description: category.description,
                  image: game.background_image || "https://via.placeholder.com/300",
                  link: `./game-categories-pages/rpg.html`
              });
          }
      }

      // Save to localStorage
      localStorage.setItem("gameCategories", JSON.stringify(categoryData));

      // Display on page
      displayCategories(categoryData);
      console.log("Fetched from API and saved to localStorage");

  } catch (error) {
      console.error("Error fetching categories:", error);
  }
}

// Function to display categories
function displayCategories(categories) {
   // Clear previous content
   document.querySelector('.js-cards-div').innerHTML =
    `
      <div class="card-list js-card-list swiper-wrapper">
              
      </div>

      <div class="swiper-pagination"></div>

      <div class="swiper-slide-button swiper-button-prev"></div>
      <div class="swiper-slide-button swiper-button-next"></div>
    `


  categories.forEach(category => {
      /*const categoryHTML = `
          <div class="slide">
            <div class="card swiper-slide" style="width: 16rem">
              <img src="${category.image}" class="card-img-top" alt="..." height="150px"/>
              <div class="card-body">
                <h5 class="card-title">>${category.name}</h5>
                <p class="card-text">
                ${category.description}
                </p>
              </div>

              <div class=" ${category.name} link-pages"></div>
            </div>
          </div>
      `;
      container.innerHTML += categoryHTML;*/

      const categoryHTML = 
      `
      <div class="card-iteM  swiper-slide">
      <div class="card">
        <img src="${category.image}" class="card-img-top" alt="..." height="150px"/>
        <div class="card-body">
          <h5 class="card-title">>${category.name}</h5>
          <p class="card-text">
          ${category.description}
          </p>
        </div>

        <div class=" ${category.name} link-pages"></div>
      </div>
      </div>
      `

      document.querySelector('.js-card-list').innerHTML += categoryHTML;


      
  });

  new Swiper('.cards-div', {
    loop: true,
    spaceBetween: 30,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },


    // Responsive breakpoints
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      },
      1024: {
        slidesPerView: 3
      }
    }
  
  });

  document.querySelector('.Action').innerHTML = 
    `<a href="./game-categories-pages/action.html" class="btn btn-outline-light">View Games</a>`

  document.querySelector('.RPG').innerHTML = 
    `<a href="./game-categories-pages/rpg.html" class="btn btn-outline-light">View Games</a>`

  document.querySelector('.Shooter').innerHTML = 
    `<a href="./game-categories-pages/shooter.html" class="btn btn-outline-light">View Games</a>`

  document.querySelector('.Sports').innerHTML = 
    `<a href="./game-categories-pages/sports-&-racing.html" class="btn btn-outline-light">View Games</a>`

  document.querySelector('.Adventure').innerHTML = 
    `<a href="./game-categories-pages/adventure.html" class="btn btn-outline-light">View Games</a>`
}



// latests reviews section

// function to get 4 random games
async function getThreeRandomGames() {
  // Check localStorage first
  const cachedGames = localStorage.getItem("cachedGames");
  if (cachedGames) {
      console.log("Loaded from localStorage");
      displayGames(JSON.parse(cachedGames));
      console.log(JSON.parse(cachedGames));
      return;
  }

  else {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&page_size=3&ordering=-added`);
      const data = await response.json();

      console.log(data.results); // Check the response in the console

      displayGames(data.results);

      localStorage.setItem('cachedGames', JSON.stringify(data.results));
      
  } catch (error) {
      console.error("Error fetching games:", error);
  }

  }
}

// function to display the 4 games
function displayGames(games) {
  let latestsReviewsHTML = '';
  games.forEach((game) => {
    latestsReviewsHTML += 
    `
   <div class="card js-card" style="width: 20rem">
     <img src="${game.background_image}" class="card-img-top" alt="..." height="150px"/>
     <div class="card-body">
       <h5 class="card-title">${game.name}</h5>
       <p class="card-text-1">
         ⭐ ${game.rating.toFixed(1)}/10
       </p>
       <p class="card-text-2">
         An exciting experience with ${game.name}. Check out the full review!
       </p>
       <a href="https://rawg.io/games/${game.slug}" target="_blank" class="btn btn2">Read Full Review</a>
     </div>
   </div>
    `
  });

  document.querySelector('.js-games-reviews-row').innerHTML = latestsReviewsHTML;
}




// latest news section

function displayGameNews() {
    let newsHTML = '';
  
    gameNews.forEach((news) => {
      newsHTML+=
      `
        <div class="row latest-news-row js-latest-news-row">
  
            <div class="game-info col-lg-6">
              <h3 class="featured-game-hero-text">${news.name}</h3>
              <pclass="fp">${news.publishedDate}</p>
              <p class="lp">${news.briefNews} <a class="js-read-more-news-btn" data-game-id="${news.id}">🔗 Read More</a></p>
            </div>
  
            <div class="game-image col-lg-6">
              <img src="${news.image}" class="card-img-top" alt="..."/>
            </div>
  
          </div>
      `
    });
  
  document.querySelector('.js-latest-news-container').innerHTML = newsHTML;

  document.querySelectorAll('.js-read-more-news-btn')
  .forEach((button) => {
    button.addEventListener('click', () => {
     const gameNewsId = button.dataset.gameId;
      window.location.href = `./news.html?id=${gameNewsId}`;
    });
  });
}


// upcoming games

async function getThreeUpcomingGames() {
  // Check localStorage first
  const cachedUpcomingGames = localStorage.getItem("cachedUpcomingGames");
  if (cachedUpcomingGames) {
      console.log("Loaded from localStorage");
      displayUpcomingGames(JSON.parse(cachedUpcomingGames));
      console.log(JSON.parse(cachedUpcomingGames));
      return;
  }

  else {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&dates=2025-02-22,2025-12-31&ordering=released&page_size=3`);
      const data = await response.json();

      console.log(data.results); // Check the response in the console
      displayUpcomingGames(data.results);
      localStorage.setItem('cachedUpcomingGames', JSON.stringify(data.results));
      
  } catch (error) {
      console.error("Error fetching games:", error);
  }

  }
}

// function to display upcoming games
function displayUpcomingGames(games) {
  let upcomingGamesHTML = '';
  games.forEach((game) => {
    upcomingGamesHTML += 
      `
      <div class="card" style="width: 20rem">
        <img src="${game.background_image}" class="card-img-top" alt="..." height="150px"/>
        <div class="card-body">
          <h5 class="card-title">${game.name}</h5>
          <p class="card-text"><span class="bt">Release Date:</span> ${game.released}</p>
          <p class="card-text"><span class="bt">Genres:</span> ${game.genres.map(g => g.name).join(", ")}</p>
          <p class="card-text"><span class="bt">Platforms:</span> ${game.platforms.map(p => p.platform.name).join(", ")}</p>
        </div>
      </div>
      `
  });

  document.querySelector('.js-upcoming-games-row').innerHTML = upcomingGamesHTML;
}




document.addEventListener("DOMContentLoaded",  () => {
  getRandomGame();
  getCategories();
  getThreeRandomGames();
  displayGameNews();
  getThreeUpcomingGames();
});


