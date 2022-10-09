let inputSearch = document.getElementById("search-input");
const allEpisodes = getAllEpisodes();

function setup() {
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  episodeList.map((episode) => {
    let cardElt = document.createElement("div");
    let titleElt = document.createElement("h2");
    let imgElt = document.createElement("div");
    let textElt = document.createElement("div");
    let episodeNum =
      episode.number < 10 ? "0" + episode.number : episode.number;

    cardElt.className = "card";
    titleElt.className = "card__title";
    imgElt.className = "card__img";
    textElt.className = "card__text";
    titleElt.textContent = `${episode.name} - S0${episode.season}E${episodeNum}`;
    imgElt.style.backgroundImage = `url(${episode.image.medium})`;
    textElt.innerHTML = episode.summary;

    cardElt.append(titleElt, imgElt, textElt);
    rootElem.appendChild(cardElt);
  });
}

function searchWord(e, episodeList) {
  let word = e.target.value.toLowerCase();
  let filteredEpisodes = episodeList.filter(
    (episode) =>
      episode.name.toLowerCase().includes(word) ||
      episode.summary.toLowerCase().includes(word)
  );

  if (word.length == 0 || filteredEpisodes.length == 0) {
    makePageForEpisodes(episodeList);
  } else {
    makePageForEpisodes(filteredEpisodes);
  }
}

inputSearch.addEventListener("input", (e) => searchWord(e, allEpisodes));
window.onload = setup;
