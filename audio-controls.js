// Set audio src fallback and setup controls
function setupAudio() {
  const audio = document.querySelector('#song')

  // Fallback on Payod's glitch repo source if no source is found
  function setAudioSrcFallback() {
    audio.addEventListener('error', function (e) {
      if (e.srcElement.error.code === 4) {
        audio.src = 'https://cdn.glitch.com/81ac89eb-0c4d-4f3f-b3ae-50c7dd330eb3%2F04.%20Stairway%20To%20Heaven.mp3?1523499841739'
      }
    })
  }

  // Function to add audio controls to the display
  function setupAudioControls() {
    const pauseBtn = document.querySelector('.pause-btn')
    const volumeSlider = document.querySelector('.volume-slider')

    // Toggle play/puase audio on button click or playback ended
    pauseBtn.addEventListener('click', togglePlayButton)
    document.getElementById('song')
      .addEventListener('ended', togglePlayButton)

    function togglePlayButton () {
      pauseBtn.innerText = pauseBtn.innerText === "Play" ? "Pause" : "Play"
      if (pauseBtn.innerText === "Play") {
        audio.pause()
      } else if (pauseBtn.innerText === "Pause") {
        audio.play()
      }
    }
    // Slider to vary the audio volume over a range from 0 to 1, set initial
    // volume to initial slider value
    audio.volume = +volumeSlider.value
    volumeSlider.oninput = (d) => audio.volume = +d.target.value
  }

  setAudioSrcFallback()
  setupAudioControls()
}

setupAudio()
