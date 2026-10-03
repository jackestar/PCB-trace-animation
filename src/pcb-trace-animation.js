const S = Math.SQRT1_2;
const DIR_X = [1, S, 0, -S, -1, -S, 0, S];
const DIR_Y = [0, S, 1, S, 0, -S, -1, -S];

export default class PCBTraceAnimation {
    constructor(traceElement, options = {}) {
        this.traceElement = traceElement;
        this.options = {
            traceColor: options.traceColor || options.color || "#000",
            viaColor: options.viaColor || options.color || "#000",
            autoResize: options.autoResize !== undefined ? options.autoResize : true,
            speed: options.speed || 4,
            gridResolution: options.gridResolution || Math.max(2, options.lineWidth || 3),
            lineSpacing: options.lineSpacing || 10,
            lineWidth: options.lineWidth || 3,
            lineMargin: options.lineMargin ?? 10,
            lineAngleVariation: options.lineAngleVariation ?? 0.008,
            lineEndCoefficient: options.lineEndCoefficient ?? 0.005,
            onComplete: options.onComplete ?? null,
        };

        this._tick = this._tick.bind(this);
        this.lines = [];
        this.history = []; // initial drawLine
        this._vias = [];
        this._resizeTimer = null;

        this.ctx = traceElement.getContext('2d');
        this.width = 0;
        this.height = 0;

        this.grid = null;
        this.gridCols = 0;
        this.gridRows = 0;

        this.PIQ = Math.PI / 4;
        this.PIT = 2 * Math.PI;
        this.PIH = Math.PI / 2;
        this.animationFrameId = null;
        this.running = false;
        this.resizeObserver = null;
    }

    initCanvas() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.traceElement.width = this.width;
        this.traceElement.height = this.height;
        this.ctx.lineCap = "round";

        this.gridCols = Math.ceil(this.width / this.options.gridResolution);
        this.gridRows = Math.ceil(this.height / this.options.gridResolution);
        this.grid = new Uint8Array(this.gridCols * this.gridRows);
    }

    restart() {
        this._reset();
        if (this.running) this._scheduleFrame();

    }

    cellIndex(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return -1;
        const res = this.options.gridResolution;
        return ((y / res) | 0) * this.gridCols + ((x / res) | 0);
    }

    markGrid(x, y) {
        const i = this.cellIndex(x, y);
        if (i !== -1) this.grid[i] = 1;
    }

    getGridCoords(x, y) {
        return {
            gx: (x / this.options.gridResolution) | 0,
            gy: (y / this.options.gridResolution) | 0
        };
    }

    markLineSegment(x1, y1, x2, y2) {
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.ceil(dist / (this.options.gridResolution * 0.8));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const px = x1 + (x2 - x1) * t;
            const py = y1 + (y2 - y1) * t;
            this.markGrid(px, py);
        }
    }

    drawVia(x, y) {
        this.ctx.fillStyle = this.options.viaColor;
        this.ctx.beginPath();
        const radius = this.options.lineWidth;
        this.ctx.arc(x, y, radius, 0, this.PIT);
        this.ctx.fill();
    }

    drawLine(posX, posY, length, isHorizontal = true, isInverted = false) {
        this.history.push([posX, posY, length, isHorizontal, isInverted]);
        this._drawTrace(posX, posY, length, isHorizontal, isInverted);
        if (this.running) this._scheduleFrame();
    }

    _reset() {
        this.initCanvas();
        this.lines = [];
        this.history.forEach(args => this._drawTrace(...args));
    }

    _scheduleFrame() {
        if (this.animationFrameId !== null) return;
        this.animationFrameId = requestAnimationFrame(this._tick);
    }

    _tick() {
        this.animationFrameId = null;
        if (!this.running) return;

        this.frame();

        if (this.lines.length === 0) {
            this.options.onComplete?.();
            return;
        }
        this._scheduleFrame();
    }

    _drawTrace(posX, posY, length, isHorizontal, isInverted) {
        const startX = this.width * posX;
        const startY = this.height * posY;
        const lineLength = (isHorizontal) ? this.width * length : this.height * length;
        const endX = startX + (isHorizontal ? lineLength : 0);
        const endY = startY + (isHorizontal ? 0 : lineLength);

        this.ctx.strokeStyle = this.options.traceColor;
        this.ctx.lineWidth = this.options.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        this.markLineSegment(startX, startY, endX, endY);

        const lineContent = this.options.lineSpacing + this.options.lineWidth;
        const lineAmount = Math.floor((lineLength - this.options.lineMargin) / lineContent);

        let lineActPos = this.options.lineMargin + (isHorizontal ? startX : startY);

        for (let line = 0; line < lineAmount; line++) {
            const lx = isHorizontal ? lineActPos : startX;
            const ly = isHorizontal ? startY : lineActPos;

            this.markGrid(lx, ly);

            this.lines.push({
                x: lx,
                y: ly,
                angle: (isInverted ? 4 : 0) + (isHorizontal ? 2 : 0), // dir
            });
            lineActPos += lineContent;
        }
    }

    frame() {
        const { ctx } = this;
        const { speed, gridResolution, lineAngleVariation, lineEndCoefficient } = this.options;
        const lines = this.lines;
        const lookAheadDist = speed + gridResolution / 2;
        const vias = this._vias;
        vias.length = 0;

        ctx.strokeStyle = this.options.traceColor;
        ctx.lineWidth = this.options.lineWidth;
        ctx.beginPath();

        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            const ux = DIR_X[line.angle];
            const uy = DIR_Y[line.angle];

            const newX = line.x + ux * speed;
            const newY = line.y + uy * speed;

            const here = this.cellIndex(line.x, line.y);
            const ahead = this.cellIndex(line.x + ux * lookAheadDist, line.y + uy * lookAheadDist);

            if (ahead !== here && (ahead === -1 || this.grid[ahead] === 1)) {
                this._removeLine(i);
                continue;
            }

            ctx.moveTo(line.x, line.y);
            ctx.lineTo(newX, newY);
            this.markLineSegment(line.x, line.y, newX, newY);
            line.x = newX;
            line.y = newY;

            if (Math.random() < lineAngleVariation) {
                line.angle = (line.angle + (Math.random() < 0.5 ? -1 : 1)) & 7;
            }

            if (Math.random() < lineEndCoefficient) {
                vias.push(line.x, line.y);
                this._removeLine(i);
            }
        }

        ctx.stroke();

        for (let v = 0; v < vias.length; v += 2) this.drawVia(vias[v], vias[v + 1]);
    }

    _removeLine(i) {
        const lines = this.lines;
        lines[i] = lines[lines.length - 1];
        lines.pop();
    }

    start() {
        if (this.running) return;
        this.running = true;
        this._reset();

        if (this.options.autoResize && typeof ResizeObserver !== 'undefined') {
            this.resizeObserver?.disconnect();
            this.resizeObserver = new ResizeObserver(() => this.restart());
            this.resizeObserver.observe(this.traceElement);
        }
        this._scheduleFrame();
    }

    stop() {
        clearTimeout(this._resizeTimer);
        this.running = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.resizeObserver?.disconnect();
    }
}