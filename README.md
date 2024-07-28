<h1 align="center">PCB Trace Animation Maker</h1>
<p align="center"><b>with HTML5 canvas</b></p>
<hr/>

Library that allows generating random line patterns that simulate PCB traces, generating an animation from the center of an integrated circuit. Implementation example: [Portafolio Jackestar](https://jackestar.netlify.app/)

<!-- ## Installation -->

<!-- using npm:

```bash
npm install pcb-maker
``` -->

## Usage

```javascript
import PCBMaker from 'pcb-maker';

const canvas = document.querySelector("canvas.headerCanvas");
const pcbMaker = new PCBMaker(canvas, "AutoRightBottom");
pcbMaker.generatePCB();
```

## Constructor

```javascript
constructor(canvas, location = "Center")
```

Parameters

- **canvas**: `HTMLCanvasElement` - The canvas element where the PCB will be drawn.
- **location**: `string` - The position of the object on the canvas. Possible values:
  - `"Center"`
  - `"HalfLeft"`
  - `"HalfRight"`
  - `"HalfTop"`
  - `"HalfBottom"`
  - `"AutoRightBottom"`
  - `"AutoLeftTop"`
  - `"HalfRightBottom"`
  - `"HalfLeftTop"`
  - `"Custom"`

## Properties

- **canvas**: `HTMLCanvasElement` -  The canvas object.
- **location**: `string` -  The position of the object on the canvas.
- **color**: `string` - color: string - The color of the traces. Default value: "#000".
- **autoResize**: `boolean` -  Automatic resizing when the canvas size changes. Default value: true.
- **autoFitSizes**: `boolean` -  Automatically generate sizes. Default value: true.
- **squareSize**: `number` -  Square size (when autoFitSizes is disabled). Default value: 0.
- **lineSpeed**: `number` -  Line speed. Default value: 4.
- **lineSpacing**: `number` -  Spacing between IC lines (when autoFitSizes is disabled). Default 
- **minLength**: `number` -  Minimum trace length before changing direction or ending. Default 
- **lineWidth**: `number` -  Line width (when autoFitSizes is disabled). Default value: 3.
- **endCoefficient**: `number` - endCoefficient: number - End probability. Default value: 0.005.
- **CustomPosX**: `number` -  Custom X position (when location is "Custom"). Default value: 0.
- **CustomPosY**: `number` -  Custom Y position (when location is "Custom"). Default value: 0.

### Position

The center where the animation is generated is defined by the **location** property. The initial value is `"Center"`, which places the animation in the center of the canvas. The options `"Half*"` place the center on the edge of the canvas, showing half of the animation, and the `"Auto**"` properties place the animation according to the width or height of the canvas. `"Half**"` does the same as `"Half*"` and `"Auto*"` combined. The "Custom" option allows the user to adjust the animation center with the **CustomPosX** and **CustomPosY** properties.
  - `"Center"`
  - `"HalfLeft"`
  - `"HalfRight"`
  - `"HalfTop"`
  - `"HalfBottom"`
  - `"AutoRightBottom"`
  - `"AutoLeftTop"`
  - `"HalfRightBottom"`
  - `"HalfLeftTop"`
  - `"Custom"`

## Methods

`generatePCB()` Generate animation

`stopPCB()` Stop animation

```javascript

const canvas = document.querySelector("canvas");
const pcbMaker = new PCBMaker(canvas, "AutoRightBottom");

// Configure optional properties
pcbMaker.color = "#ff0000";
pcbMaker.lineSpeed = 5;

// Generate PCB
pcbMaker.generatePCB();

// Stop PCB when necessary
// pcbMaker.stopPCB();

```
## TODO
- Generate only PCB without animation
- Fix collisions
- Generate multiple chips on a single canvas
- minify