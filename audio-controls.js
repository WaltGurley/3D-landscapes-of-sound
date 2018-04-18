function setupAudioControls() {
  let pauseBtn = document.querySelector('.pause-btn')
  let audio = document.querySelector('#song')

  // Toggle play/puase audio on button click
  pauseBtn.addEventListener('click', function () {
    pauseBtn.innerText = pauseBtn.innerText === "Play" ? "Pause" : "Play"
    if (pauseBtn.innerText === "Play") {
      audio.pause()
    } else if (pauseBtn.innerText === "Pause") {
      audio.play()
    }
  })
}

setupAudioControls();
