const rootElem = document.getElementById("root");
const episodesSelectTag = document.getElementById("episodes");
const showsSelectTag = document.getElementById("shows");
const resetBtn = document.querySelector(".btn-reset");
const homeBtn = document.querySelector(".btn-home");
const inputSearch = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
let readMoreBtns;
let showsTitles;
let allEpisodes = [];
let showId;

// .............Shows Related Functions.....................................................

// Fetch all shows from TVmaze API and load the page
function start() {
  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((allShows) => getAllShows(allShows));
}

// Get all shows and display them on the page
function getAllShows(showsList) {
  // Load shows cards
  makePageForShows(showsList);

  // Load show episodes cards by clicking on the show title
  showsTitles = document.querySelectorAll(".card__title--show");
  showsTitles.forEach((show) => {
    show.addEventListener("click", (e) => getShowEpisodesById(e));
  });

  // Read more button to reveal more text of the summary
  readMoreBtns = document.querySelectorAll(".card__more-btn");
  readMoreBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      let moreText = btn.nextElementSibling;
      let dots = btn.previousElementSibling;
      btn.style.display = "none";
      moreText.style.display = "inline";
      dots.style.display = "none";
    });
  });
}

// Creates and loads shows cards
function makePageForShows(showsList) {
  rootElem.innerHTML = "";
  showsSelectTag.style.display = "block";
  let sectionElt = document.createElement("section");
  sectionElt.className = "section--shows";

  showsList.map((show) => {
    let cardElt = document.createElement("article");
    let titleElt = document.createElement("h2");
    let imgElt = document.createElement("div");
    let listElt = document.createElement("ul");
    let textElt = document.createElement("p");
    let spanElt = document.createElement("span");
    let dotsElt = document.createElement("span");
    let btnElt = document.createElement("button");
    let summaryText = show.summary.replace("<p>", "").replace("</p>", "");

    cardElt.classList.add("card", "card--show");
    titleElt.className = "card__title--show";
    titleElt.id = show.id;
    imgElt.className = "card__img--show";
    listElt.className = "card__info--show";
    textElt.className = "card__text--show";
    spanElt.className = "card__extra-text";
    btnElt.className = "card__more-btn";

    titleElt.textContent = show.name;
    imgElt.style.backgroundImage = `url(${show.image.medium})`;
    listElt.innerHTML = `      
            <li><b>Rated:</b> ${show.rating.average}</li>
            <li><b>Genres:</b> ${show.genres.join(" | ")}</li>
            <li><b>Status:</b> ${show.status}</li>
            <li><b>Runtime:</b> ${show.runtime}</li>`;
    textElt.innerHTML = summaryText.substring(0, 100);
    dotsElt.innerHTML = " ... ";
    spanElt.innerHTML = summaryText.substring(100, summaryText.length);
    btnElt.innerText = "Read more";
    textElt.append(dotsElt, btnElt, spanElt);
    cardElt.append(titleElt, imgElt, listElt, textElt);
    sectionElt.appendChild(cardElt);
  });
  rootElem.appendChild(sectionElt);

  // Search input functionality
  inputSearch.addEventListener("input", (e) => {
    getShowByWord(e, showsList);
  });

  // Load shows dropdown menu
  displayShowsList(showsList);
}

// Displays shows on dropdown menu
function displayShowsList(showsList) {
  showsSelectTag.innerHTML = `<option value="-1">Select Show</option>`;
  showsList.sort((a, b) => {
    let aShowName = a.name.toLowerCase();
    let bShowName = b.name.toLowerCase();
    return aShowName < bShowName ? -1 : 1;
  });

  showsList.map((show) => {
    let option = document.createElement("option");
    option.innerText = show.name;
    option.value = show.id;
    showsSelectTag.appendChild(option);
  });
}

// Fetch all episodes from TVmaze API by show ID
function getShowEpisodesById(e) {
  if (e.target.value) {
    showId = e.target.value;
  } else {
    showId = e.target.id;
  }
  fetch("https://api.tvmaze.com/shows/" + showId + "/episodes")
    .then((response) => response.json())
    .then((allEpisodes) => getAllEpisodes(allEpisodes));
}

// search for show by word
function getShowByWord(e, showsList) {
  let word = e.target.value.toLowerCase();
  let filteredShows = showsList.filter(
    (show) =>
      show.name.toLowerCase().includes(word) ||
      show.summary.toLowerCase().includes(word)
  );

  // Displaying message only if the search input is not empty
  searchResults.innerText =
    e.target.value == "" ? "" : `Found ${filteredShows.length} shows`;

  // Displaying filtered shows
  if (filteredShows.length == 0) {
    rootElem.innerHTML = "No matching shows";
  } else {
    makePageForShows(filteredShows);
  }
}

// .............Episodes Related Functions.....................................................

// Get all Episodes and display them on the page + displays episodes listing
function getAllEpisodes(episodesList) {
  makePageForEpisodes(episodesList);
  displayEpisodesList(episodesList);

  // Onchange event of the dropdown menu selection of the episodes
  episodesSelectTag.addEventListener("change", (e) => {
    getSelectedEpisode(e, episodesList);
    searchResults.innerHTML = "";
    inputSearch.value = "";
  });

  // Go Back to all episodes view
  resetBtn.addEventListener("click", () => {
    makePageForEpisodes(episodesList);
    episodesSelectTag.value = -1;
    searchResults.innerHTML = "";
    inputSearch.value = "";
  });
}

// Creates and loads episodes cards
function makePageForEpisodes(episodesList) {
  rootElem.innerHTML = "";
  showsSelectTag.style.display = "none";
  let sectionElt = document.createElement("section");
  sectionElt.className = "section--episodes";

  episodesList.map((episode) => {
    let cardElt = document.createElement("article");
    let titleElt = document.createElement("h2");
    let imgElt = document.createElement("div");
    let textElt = document.createElement("div");
    let episodeNum = episode.number.toString().padStart(2, "0");
    let seasonNum = episode.season.toString().padStart(2, "0");
    cardElt.classList.add("card", "card--episode");
    titleElt.className = "card__title--episode";
    imgElt.className = "card__img--episode ";
    textElt.className = "card__text--episode";
    titleElt.textContent = `${episode.name} - S${seasonNum}E${episodeNum}`;
    imgElt.style.backgroundImage = `url(${episode.image.medium})`;
    textElt.innerHTML = episode.summary;
    cardElt.append(titleElt, imgElt, textElt);
    sectionElt.appendChild(cardElt);
  });
  rootElem.appendChild(sectionElt);
  inputSearch.addEventListener("input", (e) => {
    getEpisodeByWord(e, episodesList);
  });
}

// Display episodes on dropdown menu
function displayEpisodesList(episodesList) {
  episodesSelectTag.innerHTML = `<option value="-1">Select episode</option>`;
  episodesList.map((episode) => {
    let option = document.createElement("option");
    let episodeNum = episode.number.toString().padStart(2, "0");
    let seasonNum = episode.season.toString().padStart(2, "0");
    option.innerText = `S${seasonNum}E${episodeNum} - ${episode.name}`;
    option.value = `S${episode.season}E${episode.number}`;
    episodesSelectTag.appendChild(option);
  });
}

// Show selected episode
function getSelectedEpisode(e, episodesList) {
  let selectedEpisode = e.target.value;
  if (selectedEpisode == -1) {
    makePageForEpisodes(episodesList);
  } else {
    let matchedEpisode = episodesList.find((episode) => {
      let episodeNumber = `S${episode.season}E${episode.number}`;
      return episodeNumber == selectedEpisode;
    });
    makePageForEpisodes([matchedEpisode]);
  }
}

// search for episode by word
function getEpisodeByWord(e, episodesList) {
  let word = e.target.value.toLowerCase();
  let filteredEpisodes = episodesList.filter(
    (episode) =>
      episode.name.toLowerCase().includes(word) ||
      episode.summary.toLowerCase().includes(word)
  );

  // Displaying message only if the search input is not empty
  searchResults.innerText =
    e.target.value == ""
      ? ""
      : `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;

  // Displaying filtered episodes
  if (filteredEpisodes.length == 0) {
    rootElem.innerHTML = "No matching episode";
  } else {
    makePageForEpisodes(filteredEpisodes);
  }
}

// Event listeners
// Onchange event of the dropdown menu selection of the shows
showsSelectTag.addEventListener("change", (e) => {
  getShowEpisodesById(e);
  searchResults.innerHTML = "";
  inputSearch.value = "";
});

// Go back to all shows view
homeBtn.addEventListener("click", () => {
  showsSelectTag.value = -1;
  searchResults.innerHTML = "";
  inputSearch.value = "";
  start();
});

window.onload = start;
