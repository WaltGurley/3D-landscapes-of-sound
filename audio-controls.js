// Set audio src fallback and setup controls
function setupAudio() {
  const audio = document.querySelector('#song')
  // Stop audio playback initially to prevent being blasted with sound
  audio.pause()

  // Fallback on 3d-landscapes-of-sound-starter glitch repo source if no source is found
  function setAudioSrcFallback() {
    audio.addEventListener('error', function (e) {
      if (e.srcElement.error.code === 4) {
        audio.src = 'https://cdn.glitch.com/1df19d9f-97d0-4eb7-8ca3-3da116ec173e%2FWaltKevinBeat2.wav?1531947653738'
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
