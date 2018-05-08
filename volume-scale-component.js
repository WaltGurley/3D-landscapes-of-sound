// An A-Frame component to modify the x,y,z scale of an element
AFRAME.registerComponent('volume-scale', {
    schema: {
      x: {type: 'number'},
      y: {type: 'number'},
      z: {type: 'number'}
    },
    tick: function () {
      const audioAnalyser = this.el.components.audioanalyser
      if (!audioAnalyser) return console.error(`No audio analyser component connected to element with id=${this.el.id}`);
      const volume = audioAnalyser.volume

      const object3D = this.el.object3D
      object3D.scale.x = this.data.x * volume + 1
      object3D.scale.y = this.data.y * volume + 1
      object3D.scale.z = this.data.z * volume + 1
    }
})
