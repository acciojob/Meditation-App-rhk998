//your JS code here. If required.
const app = () => {
  const song = new Audio("./sounds/beach.mp3");
  const playBtn = document.querySelector(".play-area .play"); // Corrected selector for play button image
  const video = document.querySelector(".vid-container video"); // Corrected selector for video
  const timeDisplay = document.querySelector(".time-display");
  const timeButtons = document.querySelectorAll("#time-select button");
  const soundButtons = document.querySelectorAll(".sound-picker button");
  const outline = document.querySelector(".moving-outline circle"); // Select the circle inside .moving-outline
  
  // Get the total length of the circle's circumference for stroke animation
  const outlineLength = outline.getTotalLength(); 

  // Set initial stroke properties for the outline
  outline.style.strokeDasharray = outlineLength;
  outline.style.strokeDashoffset = outlineLength; // Initially hide the outline

  let fakeDuration = 600; // default 10 min (in seconds)

  // Function to update the time display
  const updateTimeDisplay = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Initial display of 10:00 (or whatever fakeDuration is set to initially)
  updateTimeDisplay(fakeDuration);

  // Play / Pause function
  const checkPlaying = () => {
    if (song.paused) {
      song.play();
      video.play();
      playBtn.src = "./svg/pause.svg";
    } else {
      song.pause();
      video.pause();
      playBtn.src = "./svg/play.svg";
    }
  };

  // Event listener for the play/pause button
  playBtn.addEventListener("click", () => {
    checkPlaying();
  });

  // Change time when a time button is clicked
  timeButtons.forEach(button => {
    button.addEventListener("click", function() {
      fakeDuration = parseInt(this.getAttribute("data-time")); // Parse to integer
      song.currentTime = 0; // Reset song time to start from beginning
      updateTimeDisplay(fakeDuration); // Update display immediately
      outline.style.strokeDashoffset = outlineLength; // Reset outline to hidden
      checkPlaying(); // Start playing immediately with new duration
    });
  });

  // Change sound & video when a sound button is clicked
  soundButtons.forEach(button => {
    button.addEventListener("click", function() {
      song.src = this.getAttribute("data-sound");
      video.src = this.getAttribute("data-video");
      song.currentTime = 0; // Reset song time to start from beginning
      checkPlaying(); // Start playing with new sound/video
    });
  });

  // Update time display and outline animation during playback
  song.ontimeupdate = () => {
    let currentTime = song.currentTime;
    let elapsed = fakeDuration - currentTime;
    
    // Update the time display
    updateTimeDisplay(elapsed);

    // Animate the circular outline
    // Calculate how much of the outline should be revealed
    const progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
    outline.style.strokeDashoffset = progress;

    // When the song finishes
    if (currentTime >= fakeDuration) {
      song.pause();
      video.pause();
      song.currentTime = 0; // Reset for next playback
      playBtn.src = "./svg/play.svg"; // Change button to play icon
      outline.style.strokeDashoffset = outlineLength; // Reset outline to hidden
    }
  };
};

// Initialize the app
app();