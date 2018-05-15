// An A-Frame component to modify the x,y,z scale of an element
AFRAME.registerComponent('frequency-bin-levels-scale', {
    schema: {
      bands: {type: 'int', default: 8},
      factor: {type: 'vec3'},
      lineAlong: {type: 'string', default: 'x-axis'},
      offsetX: {type: 'boolean'},
      offsetY: {type: 'boolean'},
      offsetZ: {type: 'boolean'},
      scale: {type: 'string', default: 'log'},
      shape: {type: 'string', default: 'box'}
    },
    init: function () {
      // Clone the initial values of the element's scale and position
      this.initialScale = this.el.object3D.scale.clone()
      this.initialPos = this.el.object3D.position.clone()

      // Set up the positioning scheme as a line along an axis using the
      // scale factor of the 'lineAlong' axis
      const xMultiplier = this.data.lineAlong === 'x-axis' ?
        this.initialScale.x : 0
      const yMultiplier = this.data.lineAlong === 'y-axis' ?
        this.initialScale.y : 0
      const zMultiplier = this.data.lineAlong === 'z-axis' ?
        this.initialScale.z : 0
      // Function that returns a one object array containing the x, y, z
      // posiiton of each child element
      const setChildPosition = (band) => [{
        x: this.initialPos.x + band * xMultiplier,
        y: this.initialPos.y + band * yMultiplier,
        z: this.initialPos.z + band * zMultiplier
      }
      ]

      // Create a child entity for each band and set some parameters
      for (let i = 0; i < this.data.bands; i++) {
        const childEntity = document.createElement('a-entity')
        this.el.appendChild(childEntity)
        childEntity.setAttribute('geometry', { primitive: 'box' })
        childEntity.setAttribute('material', { color: 'black' })
        childEntity.setAttribute('position', ...setChildPosition(i))
      }
    },
    tick: function () {
      const audioAnalyser = this.el.components.audioanalyser
      if (!audioAnalyser) return console.error(`No audio analyser component connected to element with id=${this.el.id}`);

      // Get average levels of bands
      const levels = audioAnalyser.levels
      let levelsSum = 0;
      let numFrequencies = 0;
      let bandMax = 0
      const bandedLevels = [];
      // Default to log scale if linear isn't explicitly declared
      if (this.data.scale === 'linear') {
        // Determine the bandwidth based on the levels sample size and number
        // of bands
        const bandWidth = Math.floor(levels.length / this.data.bands)
        calculateLinearAverageBins(bandWidth)
      } else {
        const logBandWidth = this.data.bands / Math.log10(levels.length)
        calculateLogAverageBins(logBandWidth)
      }

      // Function that determines the average levels within a specified
      // bandwidth over a linear scale of frequency levels and pushes to an
      // array of length this.data.bands
      function calculateLinearAverageBins(bandWidth) {
        for (let i = 0; i < levels.length; i++) {
          levelsSum += levels[i]
          numFrequencies++

          if ((i + 1) % bandWidth === 0) {
            bandedLevels.push(levelsSum / numFrequencies / 255)
            levelsSum = 0
            numFrequencies = 0
          }
        }
      }

      // Function that determines the average levels within a specified
      // bandwidth over a log10 scale of frequency levels and pushes to an
      // array of length this.data.bands
      function calculateLogAverageBins(bandWidth) {
        for (let i = 0; i < levels.length; i++) {
          levelsSum += levels[i]
          numFrequencies++

          if (Math.floor(Math.log10(i + 1) * bandWidth) > bandMax) {
            bandedLevels.push(levelsSum / numFrequencies / 255)
            levelsSum = 0
            numFrequencies = 0
            bandMax = Math.floor(Math.log10(i + 1) * bandWidth)
          }
        }
      }

      // Set the scale values of each child based on the average volume of each
      // band and scale factor
      const children = this.el.children
      for (let i = 0; i < children.length; i++) {
        children[i].object3D.scale.x = this.initialScale.x * (1 + this.data.factor.x * bandedLevels[i])
        children[i].object3D.scale.y = this.initialScale.y * (1 + this.data.factor.y * bandedLevels[i])
        children[i].object3D.scale.z = this.initialScale.z * (1 + this.data.factor.z * bandedLevels[i])

        // Set positive offset of element along axis if specified
        if (this.data.offsetX)
          { children[i].object3D.position.x = this.initialPos.x + children[i].object3D.scale.x / 2 }
        if (this.data.offsetY)
          { children[i].object3D.position.y = this.initialPos.y + children[i].object3D.scale.y / 2 }
        if (this.data.offsetZ)
          { children[i].object3D.position.z = this.initialPos.z + children[i].object3D.scale.z / 2 }
      }
    }
})
