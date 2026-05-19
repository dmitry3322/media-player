const TRACKS_URL = "music_list.json";

const tracksContainer = document.getElementById("tracks");
const audio = document.getElementById("audio");
const playerPlayPause = document.getElementById("playerPlayPause");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerProgress = document.getElementById("playerProgress");

let currentTrack = null;
let isSeeking = false;

async function loadTracks() {
  const res = await fetch(TRACKS_URL);
  const data = await res.json();
  renderTracks(data);
}

function renderTracks(list) {
  tracksContainer.innerHTML = "";

  list.forEach(track => {
    const card = document.createElement("div");
    card.className = "track-card";

    const main = document.createElement("div");
    main.className = "track-main";

    const title = document.createElement("div");
    title.className = "track-title";
    title.textContent = track.title;

    const artist = document.createElement("div");
    artist.className = "track-artist";
    artist.textContent = track.artist;

    const meta = document.createElement("div");
    meta.className = "track-meta";
    meta.textContent = track.file_type === "audio" ? "Аудио" : "Видео";

    main.appendChild(title);
    main.appendChild(artist);
    main.appendChild(meta);

    const buttons = document.createElement("div");
    buttons.className = "track-buttons";

    const hasWeb = !!track.url;
    const hasTg = !!track.file_id;

    const webBtn = document.createElement("button");
    webBtn.className = "btn btn-web";
    webBtn.textContent = "▶ WEB";
    webBtn.disabled = !hasWeb;
    if (hasWeb) {
      webBtn.addEventListener("click", () => playInWeb(track));
    }

    const tgBtn = document.createElement("button");
    tgBtn.className = "btn btn-tg";
    tgBtn.textContent = "▶ TG";
    tgBtn.disabled = !hasTg;

    buttons.appendChild(webBtn);
    buttons.appendChild(tgBtn);

    card.appendChild(main);
    card.appendChild(buttons);
    tracksContainer.appendChild(card);
  });
}

function playInWeb(track) {
  if (!track.url) return;

  currentTrack = track;
  audio.src = track.url;
  audio.play();

  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  playerPlayPause.textContent = "⏸";
}

playerPlayPause.addEventListener("click", () => {
  if (!audio.src) return;

  if (audio.paused) {
    audio.play();
    playerPlayPause.textContent = "⏸";
  } else {
    audio.pause();
    playerPlayPause.textContent = "▶";
  }
});

audio.addEventListener("timeupdate", () => {
  if (isSeeking || !audio.duration) return;
  const value = (audio.currentTime / audio.duration) * 100;
  playerProgress.value = value;
});

playerProgress.addEventListener("input", () => {
  isSeeking = true;
});

playerProgress.addEventListener("change", () => {
  if (!audio.duration) return;
  const value = playerProgress.value;
  audio.currentTime = (value / 100) * audio.duration;
  isSeeking = false;
});

audio.addEventListener("ended", () => {
  playerPlayPause.textContent = "▶";
  playerProgress.value = 0;
});

loadTracks();