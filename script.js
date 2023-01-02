// select all the required tags and elements

const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  volumnArea = wrapper.querySelector(".progress-area.volumn"),
  volumnBar = wrapper.querySelector(".progress-bar.volumn"),
  volumnCount = wrapper.querySelector(".volumn-count"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = wrapper.querySelector("#close");

//load different music every time
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  volumnCount.innerText = `${50}%`;
  mainAudio.volume = 0.5;
  loadMusic(musicIndex); // calling the music function one window loads
  playingNow();
});

//load Music
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// playmusic function
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}
// pausemusic function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}
//next music
function nextMusic() {
  musicIndex++;
  //if music index is greater than array than musicIndex is assigned as 1
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//prev music
function prevMusic() {
  musicIndex--;
  //if music index is less than array than 1 then the last music is assign
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// play or pause musin button
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  // if isMusicPaused is tru then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

// event for next button
nextBtn.addEventListener("click", () => {
  nextMusic();
});
// event for prev button
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; // get the current time
  const duration = e.target.duration; // get the duration of the music
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  let musicCurrentTime = wrapper.querySelector(".current");
  let musicDuration = wrapper.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    //update song duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  //update song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing current song time on the progress bar when click on specific time
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; //get the with of the progrss bar
  let clickedOffSetX = e.offsetX; //get the offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});

// work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  //first we ge the inner text of the icon then we will change
  let getText = repeatBtn.innerText;
  //lets do different changes on different icon click using switch
  switch (getText) {
    case "repeat": //if icon is repeat
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//after changing the icons now work on what will happen after the song ends

mainAudio.addEventListener("ended", () => {
  //perform according to the icon after the song ends
  let getText = repeatBtn.innerText;
  //lets do different changes on different icon click using switch
  switch (getText) {
    case "repeat": //if icon is repeat simply we call next music
      nextMusic();
      break;
    case "repeat_one": // if icon is repeat play the same music
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle": // if icon is suffle suffle the playlist
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex === randIndex);
      musicIndex = randIndex; //passing the randIndex to the music index
      loadMusic(musicIndex); //calling the loadMusic function
      playMusic(); //calling the playMusic function
      playingNow();
      break;
  }
});

//show playlist
showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
//close playlist
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//create li according to the array length

for (let i = 0; i < allMusic.length; i++) {
  //pass the song name,artist from the array to li
  let liTag = ` <li li-index="${i + 1}">
                    <div class="row">
                      <span>${allMusic[i].name}</span>
                      <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
                    <span id="${
                      allMusic[i].src
                    }" class="audio-duration">3:40</span>
                </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);
  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

// function to playing the particular song selected from the list

const allLiTags = ulTag.querySelectorAll("li");

function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    // remove the playing class from the current playing music
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      //get the audio duration from the t-duration attribute
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    // if here is a li tag which li-index is equal to musicIndex
    //then this music is playing noew and we will style it
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    // adding onclick attribute to all the li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //passing the liindex to the musicindex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//added volumn
volumnArea.addEventListener("click", (e) => {
  let progressWidthval = volumnArea.clientWidth; //get the with of the progrss bar
  let clickedOffSetX = e.offsetX; //get the offset x value
  let volumnWidth = (clickedOffSetX / progressWidthval) * 100;
  if (volumnWidth > 100) {
    volumnWidth = 100;
  }
  if (volumnWidth < 0) {
    volumnWidth = 0;
  }
  volumnBar.style.width = `${volumnWidth}%`;
  volumnCount.innerText = `${Math.trunc(volumnWidth)}%`;
  let appliedVolumn = volumnWidth / 100;
  mainAudio.volume = appliedVolumn;
});
