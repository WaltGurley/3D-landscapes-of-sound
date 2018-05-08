// TODO DELAY LOG FOR TESTING - REMOVE
const delayLog = {
  count: 0,
  logOnDelay: function(logThis) {
    // Log on every 60 frame updates
    if (this.count % 60 === 0) {
      console.log(logThis)
    }
    this.count++
  }
}
