const app = () => {
  const song = new Audio("./sounds/beach.mp3");
  const playBtn = document.querySelector(".play-area .play");
  const video = document.querySelector(".vid-container video");
  const timeDisplay = document.querySelector(".time-display");
  const timeButtons = document.querySelectorAll("#time-select button");
  const soundButtons = document.querySelectorAll(".sound-picker button");
  const outline = document.querySelector(".moving-outline circle");

  const outlineLength = outline.getTotalLength();
  outline.style.strokeDasharray = outlineLength;
  outline.style.strokeDashoffset = outlineLength;

  let fakeDuration = 600; // default 10 min
  let isPlaying = false;

  // format m:s (not mm:ss) because Cypress expects 10:0, 2:0 etc
  const updateTimeDisplay = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    timeDisplay.textContent = `${minutes}:${seconds}`;
  };

  updateTimeDisplay(fakeDuration);

  // Play / Pause toggle
  const checkPlaying = () => {
    if (!isPlaying) {
      song.play();
      video.play();
      playBtn.src = "./svg/pause.svg";
      isPlaying = true;
    } else {
      song.pause();
      video.pause();
      playBtn.src = "./svg/play.svg";
      isPlaying = false;
    }
  };

  playBtn.addEventListener("click", () => {
    checkPlaying();
  });

  // Change time buttons
  // timeButtons.forEach(button => {
  //   button.addEventListener("click", function() {
  //     fakeDuration = parseInt(this.getAttribute("data-time"));
		// song.pause();
  //   video.pause();
  //     song.currentTime = 0;
  //     updateTimeDisplay(fakeDuration);
  //     outline.style.strokeDashoffset = outlineLength;
  //     isPlaying = false; // reset play state
  //     playBtn.src = "./svg/play.svg"; // ensure play icon
  //   });
  // });

	timeButtons.forEach(button => {
  button.addEventListener("click", function () {
    // Get new duration
    fakeDuration = parseInt(this.getAttribute("data-time"));

    // 🔴 Stop playback first
    song.pause();
    video.pause();
    song.currentTime = 0;
    video.currentTime = 0;

    // 🔴 Reset circle + UI
    outline.style.strokeDashoffset = outlineLength;
    playBtn.src = "./svg/play.svg";
    isPlaying = false;

    // 🔴 Finally update display (AFTER pausing)
    updateTimeDisplay(fakeDuration);
  });
});


  // Change sound & video
  soundButtons.forEach(button => {
    button.addEventListener("click", function() {
      song.src = this.getAttribute("data-sound");
      video.src = this.getAttribute("data-video");
      song.currentTime = 0;
      isPlaying = false;
      playBtn.src = "./svg/play.svg";
      updateTimeDisplay(fakeDuration);
    });
  });

  // Update every tick
  song.ontimeupdate = () => {
    let currentTime = song.currentTime;
    let elapsed = fakeDuration - currentTime;

    updateTimeDisplay(elapsed);

    const progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
    outline.style.strokeDashoffset = progress;

    if (currentTime >= fakeDuration) {
      song.pause();
      video.pause();
      song.currentTime = 0;
      playBtn.src = "./svg/play.svg";
      outline.style.strokeDashoffset = outlineLength;
      isPlaying = false;
    }
  };
};

app();
