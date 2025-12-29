<h1 align="center">PCB Trace Animation Maker</h1>
<p align="center"><b>with HTML5 canvas</b></p>
<hr/>

Library that allows generating random line patterns that simulate PCB traces, Implementation example: [Portafolio Jackestar](https://jackestar.netlify.app/)

**Highlights**
- **Small & dependency-free:** Pure JS, renders to a `<canvas>` 2D context.
- **Configurable behaviour:** Speed, colors, spacing, and randomness are adjustable via options.
- **Collision-aware:** Internal grid tracking prevents traces from overlapping already-drawn paths.

**Quick Start**

- Add a canvas to your HTML and include the script that exports `PCBTraceAnimation`.

```html
<canvas id="trace" style="width:100%;height:100%;display:block"></canvas>
<script src="src/pcb-trace-animation.js"></script>
<script>
  const canvas = document.getElementById('trace');
  // Pass options as needed
  const anim = new PCBTraceAnimation(canvas, {
    traceColor: '#0f0',
    viaColor: '#ff0',
    speed: 4,
  });
  anim.start();
  // call anim.stop() to halt
</script>
```

**API**

- `new PCBTraceAnimation(traceElement, options = {})` : Create an instance.
  - `traceElement` - a `<canvas>` element (2D context will be used).
  - `options` - configuration object (see options list below).
- `start()` : Initialize canvas/grid and begin the animation loop.
- `stop()` : Stop the animation and disconnect resize observer if enabled.
- `drawLine(...)`, `drawVia(...)`: Utility methods exist on the class (used internally). `drawLine` can be used to draw predefined lines programmatically: `drawLine(posX, posY, length, isHorizontal = true, isInverted = false)`.

**Options & Defaults**

The library accepts an options object. Defaults are taken from the implementation; core options include:

- **`traceColor`**: `#000` — color used for stroke lines (alias: `color`).
- **`viaColor`**: `#000` — fill color for vias.
- **`autoResize`**: `true` — when enabled, keeps the canvas sized to window and reinitializes grid on resize.
- **`speed`**: `4` — pixels per frame movement speed for trace segments.
- **`gridResolution`**: `Math.max(2, lineWidth || 3)` — internal grid cell size used to track occupied areas.
- **`lineSpacing`**: `10` — spacing between generated parallel lines.
- **`minLength`**: `10` — minimum length for something like programmatic line placement (internal use).
- **`lineWidth`**: `3` — line/stroke width.
- **`lineMargin`**: `10` — margin from the start of a drawn line before placing generated segments.
- **`lineAngleVariation`**: `0.008` — per-frame probability a moving segment turns 90°.
- **`lineEndCoefficient`**: `0.005` — per-frame probability a moving segment ends and draws a via.

Use `color` as a shorthand for `traceColor` when convenient.

**Behavior Notes**

- The library maintains an internal Uint8Array grid of size `ceil(width / gridResolution) * ceil(height / gridResolution)`. When traces are drawn the corresponding grid cells are marked so new traces avoid overlaps.
- Movement checks use a small "look-ahead" point to anticipate collisions when stepping into a new grid cell; this reduces false positives while allowing tight tunnels.
- Random turns and random ends add organic variation; tune `lineAngleVariation` and `lineEndCoefficient` to control fracturing vs. long traces.

**Example: Drawing a horizontal line programmatically**

```js
// Draw a horizontal full-width starter line at 30% height
anim.drawLine(0, 0.3, 1.0, true, false);
```

**Styling & Performance Tips**

- Use `lineWidth` and `gridResolution` in tandem. A grid resolution roughly equal to `lineWidth` generally gives the best visual and collision results.
- Lower `lineAngleVariation` / `lineEndCoefficient` for longer, straighter traces. Increase `speed` for faster animation, but beware of skipped cells if `speed` becomes much larger than `gridResolution`.
- Disable `autoResize` if you want to control canvas sizing manually (then call `initCanvas()` on resize if you expose it).

**Demo & Example**

See the repository `example/` folder for a minimal runnable demo showing how to wire up the canvas and script.

**License**

MIT License

## TODO

* Better DOC
* no % logic
* draw rectangle
* angle draw