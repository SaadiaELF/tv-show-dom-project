const inputSearch = document.getElementById("search-input");
const selectEpisodeTag = document.getElementById("episodes");
const selectShowTag = document.getElementById("shows");
const resetBtn = document.querySelector(".btn-reset");
const rootElem = document.getElementById("root");
let allEpisodes;
let allShows = getAllShows();
const url = "https://api.tvmaze.com/shows/82/episodes";

// Fetch all episodes from TVmaze API
fetch(url)
  .then((response) => response.json())
  .then((data) => (allEpisodes = data));

function setup() {
  makePageForEpisodes(allEpisodes);
  selectEpisode(allEpisodes);
  selectShow(allShows);
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

// Select episode
function selectEpisode(episodesList) {
  episodesList.map((episode) => {
    let option = document.createElement("option");
    let episodeNum =
      episode.number < 10 ? "0" + episode.number : episode.number;
    let seasonNum = episode.season < 10 ? "0" + episode.season : episode.season;

    option.innerText = `S${seasonNum}E${episodeNum} - ${episode.name}`;
    option.value = `S${episode.season}E${episode.number}`;
    selectEpisodeTag.appendChild(option);
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
function searchWord(e, episodesList) {
  const searchResults = document.getElementById("search-results");
  let word = e.target.value.toLowerCase();
  let filteredEpisodes = episodesList.filter(
    (episode) =>
      episode.name.toLowerCase().includes(word) ||
      episode.summary.toLowerCase().includes(word)
  );
  searchResults.innerText = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;
  if (filteredEpisodes.length == 0) {
    rootElem.innerHTML = "No matching episode";
  } else {
    makePageForEpisodes(filteredEpisodes);
  }
}

// Select show
function selectShow(showsList) {
  showsList.sort((a, b) => {
    let aShowName = a.name.toLowerCase();
    let bShowName = b.name.toLowerCase();
    return aShowName < bShowName ? -1 : 1;
  });

  showsList.map((show) => {
    let option = document.createElement("option");
    option.innerText = show.name;
    option.value = show.id;
    selectShowTag.appendChild(option);
  });
}

// Event listeners
inputSearch.addEventListener("input", (e) => searchWord(e, allEpisodes));
selectEpisodeTag.addEventListener("change", (e) => showEpisode(e, allEpisodes));
resetBtn.addEventListener("click", () => {
  makePageForEpisodes(allEpisodes);
  selectTag.value = -1;
});
window.onload = setup;
