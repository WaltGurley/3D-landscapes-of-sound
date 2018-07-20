// An A-Frame component to modify the x,y,z scale of an element
AFRAME.registerComponent('audio-level-scale', {
    schema: {
      sizeScale: {type: 'vec3'},
      positionScale: {type: 'vec3'},
      offsetX: {type: 'boolean'},
      offsetY: {type: 'boolean'},
      offsetZ: {type: 'boolean'}
    },
    init: function () {
      // Clone the initial values of the element's scale and position
      this.initialScale = this.el.object3D.scale.clone()
      this.initialPos = this.el.object3D.position.clone()
    },
    tick: function () {
      const audioAnalyser = this.el.components.audioanalyser
      if (!audioAnalyser) return console.error(`No audio analyser component connected to element with id=${this.el.id}`);

      // Get audio levels and nromalize by max value of 255
      const normalizedLevel = audioAnalyser.volume / 255

      // Modify the scale and position at the three.js level, object3D
      const object3D = this.el.object3D

      // Set the scale values based on volume and scale factor
      object3D.scale.x = this.initialScale.x * (1 + this.data.sizeScale.x * normalizedLevel)
      object3D.scale.y = this.initialScale.y * (1 + this.data.sizeScale.y * normalizedLevel)
      object3D.scale.z = this.initialScale.z * (1 + this.data.sizeScale.z * normalizedLevel)

      // Set the position values based on volume and scale factor
      object3D.position.x = this.initialPos.x + (1 + this.data.positionScale.x * normalizedLevel)
      object3D.position.y = this.initialPos.y + (1 + this.data.positionScale.y * normalizedLevel)
      object3D.position.z = this.initialPos.z + (1 + this.data.positionScale.z * normalizedLevel)

      // Set positive offset of element along axis if specified
      if (this.data.offsetX)
        { object3D.position.x = this.initialPos.x + object3D.scale.x / 2 }
      if (this.data.offsetY)
        { object3D.position.y = this.initialPos.y + object3D.scale.y / 2 }
      if (this.data.offsetZ)
        { object3D.position.z = this.initialPos.z + object3D.scale.z / 2 }
    }
})
