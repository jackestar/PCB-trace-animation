<h1 align="center">PCB Trace Animation Maker</h1>
<p align="center"><b>con canvas HTML5</b></p>
<hr/>

Libreria que permite generar patrones de líneas aleatorios que simulan trazos de PCB, generando una animacion una animacion desde el centro de un integrado. Ejemplo de implementacion: [Portafolio Jackestar](https://jackestar.netlify.app/)

**Aspectos destacados**
- **Pequeño y sin dependencias:** JavaScript puro, renderiza en un contexto 2D `<canvas>`.
- **Comportamiento configurable:** La velocidad, los colores, el espaciado y la aleatoriedad se pueden ajustar mediante opciones.
- **Consciente de colisiones:** El seguimiento interno de la cuadrícula evita que los trazos se superpongan a las rutas ya dibujadas.

**Inicio rápido**

- Agrega un lienzo a tu HTML e incluye el script que exporta `PCBTraceAnimation`.

```html
<canvas id="trace" style="width:100%;height:100%;display:block"></canvas>
<script src="src/pcb-trace-animation.js"></script>
<script>
const canvas = document.getElementById('trace'); // Pasar las opciones según sea necesario
const anim = new PCBTraceAnimation(canvas, {
traceColor: '#0f0',
viaColor: '#ff0',
speed: 4,
});
anim.start();
// llamar a anim.stop() para detener
</script>
```

**API**

- `new PCBTraceAnimation(traceElement, options = {})`: Crear una instancia.
- `traceElement`: un elemento `<canvas>` (se usará el contexto 2D).
- `options`: objeto de configuración (ver la lista de opciones a continuación).
- `start()`: Inicializar el lienzo/cuadrícula e iniciar el bucle de animación.
- `stop()`: Detener la animación y desconectar el observador de cambio de tamaño si está habilitado.
- `drawLine(...)`, `drawVia(...)`: Existen métodos de utilidad en la clase (se usan internamente). `drawLine` se puede usar para dibujar líneas predefinidas mediante programación: `drawLine(posX, posY, length, isHorizontal = true, isInverted = false)`.

**Opciones y valores predeterminados**

La biblioteca acepta un objeto de opciones. Los valores predeterminados se toman de la implementación; las opciones principales incluyen:

- **`traceColor`**: `#000` — color usado para líneas de trazo (alias: `color`).
- **`viaColor`**: `#000` — color de relleno para las vías.
- **`autoResize`**: `true` — cuando está habilitado, mantiene el lienzo con el tamaño de ventana y reinicia la cuadrícula al redimensionarlo.
- **`speed`**: `4` — velocidad de movimiento de píxeles por fotograma para los segmentos de trazo.
- **`gridResolution`**: `Math.max(2, lineWidth || 3)` — tamaño de celda de la cuadrícula interna usado para rastrear las áreas ocupadas. - **`lineSpacing`**: `10` — espaciado entre líneas paralelas generadas.
- **`minLength`**: `10` — longitud mínima para, por ejemplo, la colocación programática de líneas (uso interno).
- **`lineWidth`**: `3` — ancho de línea/trazo.
- **`lineMargin`**: `10` — margen desde el inicio de una línea dibujada antes de colocar los segmentos generados.
- **`lineAngleVariation`**: `0.008` — probabilidad por fotograma de que un segmento en movimiento gire 90°.
- **`lineEndCoefficient`**: `0.005` — probabilidad por fotograma de que un segmento en movimiento termine y dibuje una vía.

Use `color` como abreviatura de `traceColor` cuando sea conveniente.

**Notas de Comportamiento**

- La biblioteca mantiene una cuadrícula Uint8Array interna de tamaño `ceil(width / gridResolution) * ceil(height / gridResolution)`. Al dibujar trazos, se marcan las celdas correspondientes de la cuadrícula para evitar superposiciones en los nuevos trazos.
- Las comprobaciones de movimiento utilizan un pequeño punto de "previsión" para anticipar colisiones al entrar en una nueva celda de la cuadrícula; esto reduce los falsos positivos y permite túneles estrechos.
- Los giros y finales aleatorios añaden variación orgánica; ajuste `lineAngleVariation` y `lineEndCoefficient` para controlar la fracturación frente a trazos largos.

**Ejemplo: Dibujar una línea horizontal programáticamente**

```js
// Dibujar una línea de inicio horizontal de ancho completo a una altura del 30 %
anim.drawLine(0, 0.3, 1.0, true, false);
```

**Consejos de estilo y rendimiento**

- Use `lineWidth` y `gridResolution` simultáneamente. Una resolución de cuadrícula aproximadamente igual a `lineWidth` generalmente ofrece los mejores resultados visuales y de colisión.
- Reduzca `lineAngleVariation` / `lineEndCoefficient` para obtener trazos más largos y rectos. Aumente `speed` para una animación más rápida, pero tenga cuidado con las celdas omitidas si `speed` es mucho mayor que `gridResolution`.
- Desactive `autoResize` si desea controlar el tamaño del lienzo manualmente (luego, ejecute `initCanvas()` al redimensionarlo si lo expone).

**Demostración y ejemplo**

Consulte la carpeta `example/` del repositorio para obtener una demostración mínima ejecutable que muestra cómo conectar el lienzo y el script.

**Licencia**

MIT License