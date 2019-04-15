# 3D Landscapes of Sound

> Use A-Frame components to analyze audio and generate real-time audio-reactive 3D objects.

These materials were developed for a workshop as part of the [NCSU Libraries Data and Visualization workshop series](https://www.lib.ncsu.edu/workshops/category/data-and-visualization).

The A-Frame components created for this workshop are based on code developed by [Payod Panda](https://github.com/PayodPanda) and incorporate the incorporates the [aframe-audioanalyser-component](https://github.com/ngokevin/kframe/tree/master/components/audioanalyser/) to access Web Audio data in A-Frame.

## Components and methods

This application uses four specialized A-frame components for creating audio-reactive 3D objects. Each component is defined in a JavaScript file contained in the root directory (`aframe-audioanalyser-component.js`, `audio-level-scale-component.js`, `frequency-spectrum-component.js`, and `spectrogram-component.js`). The component `aframe-audioanalyser-component` provides the necessary functionality to read and analyze audio data using the WebAudio API. The other three components provide the functionality to modify object properties using data returned from the `aframe-audioanalyser-component`.

### audio-level-scale-component

The `audio-level-scale-component` provides the functionality to scale either the size or position of one shape based on the average volume across the measured audio frequencies of the audio source.

### frequency-spectrum-component

The `frequency-spectrum-component` provides the functionality to scale the size or position of a collection of shapes arranged in a line. The amount to which each shape in the collection is scaled is mapped along the line to the average volume of a specified range of frequencies, from low to high. This component generates a representation of the audio source frequency spectrum levels.

### spectrogram-component

The `spectrogram-component` provides the functionality to scale the size or position of a collection of shapes arranged in a grid. The amount to which each shape in the collection is scaled is mapped along one axis of the grid to the average volume of a specified range of frequencies from low to high (frequency bins). The other dimension is scaled based on the frequency values at time `t - n`, where `t` represents the current sample time and `n` represents the number of the specified row along this dimension. This component generates a representation of the audio source frequency spectrum levels over time, or a spectrogram.

### Common Methods for All Components

The following methods are available in `audio-level-scale-component.js`, `frequency-spectrum-component.js`, and `spectrogram-component.js`

#### sizeScale
The maximum size to scale an entity along the x, y, or z axis based on initial scale and audio levels.
```html
  "sizeScale: x y z"
```

*Example:* scale the size of a box to a maximum of 4 times its initial scale along the x axis, 2 times its initial scale along the y axis, and 0 times its initial scale along the z axis
```html
<a-sphere
  ...
  audio-level-scale="sizeScale: 4 2 0"
  ...
></a-sphere>
```

#### positionScale
The maximum position offset to scale an entity along the x, y, or z axis based on initial position and audio levels.
```
  "positionScale: x y z"
```

*Example:* offset the position of a box along the z-axis to a maximum of 2 times the initial z position
```html
<a-box
  ...
  frequency-spectrum="positionScale: 0 10 0;"
  ...
></a-box>
```

#### offsetX, offsetY, offsetZ
Offsets the scaling factor to produce scaling in only one direction along an axis. The offset along each axis is set to false by default and can be enabled by setting the specified property to true. This option can be used with sizeScale to generate bars that have a set baseline and scale in one direction.
```
  "offsetX: boolean"
  "offsetY: boolean"
  "offsetZ: boolean"
```

*Example:* scale the size of a box to a maximum of 10 times its initial scale along the y axis and offset the y-axis scaling
```html
<a-box
  ...
  frequency-spectrum="sizeScale: 0 10 0; offsetY: true;"
  ...
></a-box>
```

### audio-level-scale-component methods

The **Common Methods for All Components** section covers all methods provided by this component

### frequency-spectrum-component methods

TODO ...

### spectrogram-component methods

TODO ...