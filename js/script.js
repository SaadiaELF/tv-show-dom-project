const rootElem = document.getElementById("root");
const episodesSelectTag = document.getElementById("episodes");
const showsSelectTag = document.getElementById("shows");
const resetBtn = document.getElementById("btn-reset");
const inputSearch = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
let allEpisodes = [];
let allShows = [];
let showId;

function start() {
  // Fetch all shows from TVmaze API
  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((allShows) => displayShowsList(allShows));
}

function getEpisodes() {
  makePageForEpisodes(allEpisodes);
  displayEpisodesList(allEpisodes);
}

// Loads episodes cards
function makePageForEpisodes(episodesList) {
  rootElem.innerHTML = "";
  episodesList.map((episode) => {
    let cardElt = document.createElement("div");
    let titleElt = document.createElement("h2");
    let imgElt = document.createElement("div");
    let textElt = document.createElement("div");
    let episodeNum =
      episode.number < 10 ? "0" + episode.number : episode.number;
    let seasonNum = episode.season < 10 ? "0" + episode.season : episode.season;

    cardElt.className = "card";
    titleElt.className = "card__title";
    imgElt.className = "card__img";
    textElt.className = "card__text";
    titleElt.textContent = `${episode.name} - S${seasonNum}E${episodeNum}`;
    imgElt.style.backgroundImage = `url(${episode.image.medium})`;
    textElt.innerHTML = episode.summary;

    cardElt.append(titleElt, imgElt, textElt);
    rootElem.appendChild(cardElt);
  });
}

// Display episodes on select input
function displayEpisodesList(episodesList) {
  episodesSelectTag.innerHTML = `<option value="-1">Select episode</option>`;
  episodesList.map((episode) => {
    let option = document.createElement("option");
    let episodeNum =
      episode.number < 10 ? "0" + episode.number : episode.number;
    let seasonNum = episode.season < 10 ? "0" + episode.season : episode.season;

    option.innerText = `S${seasonNum}E${episodeNum} - ${episode.name}`;
    option.value = `S${episode.season}E${episode.number}`;
    episodesSelectTag.appendChild(option);
  });
}

// Show selected episode
function showEpisode(e, episodesList) {
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

// Displays shows on select input
function displayShowsList(showsList) {
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

// Get show by id
function getShow(e) {
  showId = e.target.value;

  // Fetch all episodes from TVmaze API by selected show
  fetch("https://api.tvmaze.com/shows/" + showId + "/episodes")
    .then((response) => response.json())
    .then((data) => (allEpisodes = data))
    .then(() => getEpisodes());
}

// Event listeners
inputSearch.addEventListener("input", (e) => getEpisodeByWord(e, allEpisodes));
episodesSelectTag.addEventListener("change", (e) =>
  showEpisode(e, allEpisodes)
);
showsSelectTag.addEventListener("change", (e) => getShow(e));
resetBtn.addEventListener("click", () => {
  makePageForEpisodes(allEpisodes);
  episodesSelectTag.value = -1;
});

window.onload = start;
