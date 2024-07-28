<h1 align="center">PCB Trace Animation Maker</h1>
<p align="center"><b>con canvas HTML5</b></p>
<hr/>

Libreria que permite generar patrones de líneas aleatorios que simulan trazos de PCB, generando una animacion una animacion desde el centro de un integrado. Ejemplo de implementacion: [Portafolio Jackestar](https://jackestar.netlify.app/)

<!-- ## Instalación -->

<!-- usando npm:

```bash
npm install pcb-maker
``` -->

## Uso

```javascript
import PCBMaker from 'pcb-trace-animation';

const canvas = document.querySelector("canvas.headerCanvas");
const pcbMaker = new PCBMaker(canvas, "AutoRightBottom");
pcbMaker.generatePCB();
```

## Constructor

```javascript
constructor(canvas, location = "Center")
```

### Parámetros

- **canvas**: `HTMLCanvasElement` - El elemento canvas donde se dibujará el PCB.
- **location**: `string` - La posición del objeto en el canvas. Valores posibles:
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

## Propiedades

- **canvas**: `HTMLCanvasElement` - El objeto canvas.
- **location**: `string` - La posición del objeto en el canvas.
- **color**: `string` - El color de las trazas. Valor por defecto: `"#000"`.
- **autoResize**: `boolean` - Ajuste automático del tamaño al cambiar el tamaño del canvas. Valor por defecto: `true`.
- **autoFitSizes**: `boolean` - Generar tamaños automáticamente. Valor por defecto: `true`.
- **squareSize**: `number` - Tamaño del cuadrado (cuando `autoFitSizes` está desactivado). Valor por defecto: `0`.
- **lineSpeed**: `number` - Velocidad de las líneas. Valor por defecto: `4`.
- **lineSpacing**: `number` - Espacio entre líneas de IC (cuando `autoFitSizes` está desactivado). Valor por defecto: `10`.
- **minLength**: `number` - Longitud mínima de la traza antes de cambiar de dirección o finalizar. Valor por defecto: `8` (2 * `lineSpeed`).
- **lineWidth**: `number` - Ancho de las líneas (cuando `autoFitSizes` está desactivado). Valor por defecto: `3`.
- **endCoefficient**: `number` - Probabilidad de finalización. Valor por defecto: `0.005`.
- **CustomPosX**: `number` - Posición personalizada en X (cuando `location` es `"Custom"`). Valor por defecto: `0`.
- **CustomPosY**: `number` - Posición personalizada en Y (cuando `location` es `"Custom"`). Valor por defecto: `0`.

### Posicion

El centro donde se genera la animacion viene definido por la propiedad **location**, el valor inicial es `"Center"` que ubica la animacion en el centro del canvas, las opciones `"Half*"` ubican el centro en el borde del canvas, lo que mustra la mitad de la animacion y las propiedades `"Auto**"` ubican la animacion segun el ancho o alto del canvas y `"Half**"` hace lo mismo que `"Half*"` y `"Auto*"` combinados. La opcion `"Custom"` permite al usuario ajustar el centro de la animacion con las propiedades **CustomPosX** y **CustomPosY**
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


## Métodos

`generatePCB()` Generar animacion

`stopPCB()` Detener animacion

## Ejemplo

```javascript

const canvas = document.querySelector("canvas");
const pcbMaker = new PCBMaker(canvas, "AutoRightBottom");

// Configurar propiedades opcionales
pcbMaker.color = "#ff0000";
pcbMaker.lineSpeed = 5;

// Generar PCB
pcbMaker.generatePCB();

// Detener PCB cuando sea necesario
// pcbMaker.stopPCB();
```

## TODO

- Generar solo PCB sin animacion
- Corregir coliciones
- Generar muliples chips en un solo canvas
- Version minificada