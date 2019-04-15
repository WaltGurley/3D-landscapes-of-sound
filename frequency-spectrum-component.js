// An A-Frame component to modify the x,y,z scale of an element
AFRAME.registerComponent('frequency-bin-levels-scale', {
    schema: {
      bins: {type: 'int', default: 8},
      factor: {type: 'vec3'},
      sizeScale: {type: 'vec3'},
      positionScale: {type: 'vec3'},
      spacing: {type: 'vec3'},
      binAlong: {type: 'string', default: 'x-axis'},
      offsetX: {type: 'boolean'},
      offsetY: {type: 'boolean'},
      offsetZ: {type: 'boolean'},
      frequencyScale: {type: 'string', default: 'log'},
      shape: {type: 'string', default: 'box'},
      color: {type: 'string', default: 'grey'}
    },
    init: function () {
      // Clone the initial values of the element's scale and position
      this.initialScale = this.el.object3D.scale.clone()
      this.initialPos = this.el.object3D.position.clone()
      this.childrenInitialPos = []

      // Set up the positioning scheme as a line along an axis using the
      // scale factor of the 'binAlong' axis
      const xMultiplier = this.data.binAlong === 'x-axis' ?
        this.initialScale.x : 0
      const yMultiplier = this.data.binAlong === 'y-axis' ?
        this.initialScale.y : 0
      const zMultiplier = this.data.binAlong === 'z-axis' ?
        this.initialScale.z : 0
      // Function that returns a one object array containing the x, y, z
      // posiiton of each child element
      const setChildPosition = (band) => [{
        x: this.initialPos.x + band * xMultiplier +
          this.data.spacing.x * band,
        y: this.initialPos.y + band * yMultiplier +
          this.data.spacing.y * band,
        z: this.initialPos.z + band * zMultiplier +
          this.data.spacing.z * band
      }
      ]

      // Create a child entity for each band and set some parameters
      for (let i = 0; i < this.data.bins; i++) {
        const childEntity = document.createElement('a-entity')
        this.el.appendChild(childEntity)
        childEntity.setAttribute('geometry', { primitive: this.data.shape })
        childEntity.setAttribute('material', { color: this.data.color })
        childEntity.setAttribute('position', ...setChildPosition(i))
        this.childrenInitialPos.push(...setChildPosition(i))
      }
    },
    tick: function () {
      const audioAnalyser = this.el.components.audioanalyser
      if (!audioAnalyser) return console.error(`No audio analyser component connected to element with id=${this.el.id}`);

      // Get average levels of bins
      const levels = audioAnalyser.levels
      let levelsSum = 0;
      let numFrequencies = 0;
      let bandMax = 0
      const bandedLevels = [];
      // Default to log scale if linear isn't explicitly declared
      if (this.data.frequencyScale === 'linear') {
        // Determine the bandwidth based on the levels sample size and number
        // of bins
        const bandWidth = Math.floor(levels.length / this.data.bins)
        calculateLinearAverageBins(bandWidth)
      } else {
        const logBandWidth = this.data.bins / Math.log10(levels.length)
        calculateLogAverageBins(logBandWidth)
      }

      // Function that determines the average levels within a specified
      // bandwidth over a linear scale of frequency levels and pushes to an
      // array of length this.data.bins
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
      // array of length this.data.bins
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

      // Set the scale values of each child based on the average volume of each band and scale factor
      const children = this.el.children
      for (let i = 0; i < children.length; i++) {
        const child = children[i].object3D

        child.scale.x = this.initialScale.x * (1 + this.data.sizeScale.x * bandedLevels[i])
        child.scale.y = this.initialScale.y * (1 + this.data.sizeScale.y * bandedLevels[i])
        child.scale.z = this.initialScale.z * (1 + this.data.sizeScale.z * bandedLevels[i])

        child.position.x = this.childrenInitialPos[i].x + (1 + this.data.positionScale.x * bandedLevels[i])
        child.position.y = this.childrenInitialPos[i].y + (1 + this.data.positionScale.y * bandedLevels[i])
        child.position.z = this.childrenInitialPos[i].z + (1 + this.data.positionScale.z * bandedLevels[i])

        // Set positive offset of element along axis if specified
        if (this.data.offsetX)
          { child.position.x = this.initialPos.x + child.scale.x / 2 }
        if (this.data.offsetY)
          { child.position.y = this.initialPos.y + child.scale.y / 2 }
        if (this.data.offsetZ)
          { child.position.z = this.initialPos.z + child.scale.z / 2 }
      }
    }
})
