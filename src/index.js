class PCBMaker {
    constructor(canvas, location = "Center") {

        // User Config
        this.canvas = canvas;               // Canvas Object
        this.location = location;           // Object Position
        this.color = "#000";                // Trace color
        this.autoResize = true;             // Auto resize on changes
        this.autoFitSizes = true;           // Generate Sizes
        this.squareSize = 0;                // (!autoFitSizes) square size
        this.lineSpeed = 4;                 // line speed
        this.lineSpacing = 10;              // (!autoFitSizes) IC line space
        this.minLength = this.lineSpeed*2;  // min IC length before change direction or end
        this.lineWidth = 3;                 // (!autoFitSizes) line width
        this.endCoefficient = 0.005         // end chance
        this.CustomPosX = 0;                // Custom Position in X
        this.CustomPosY = 0;                // Custom Position in Y
        
        this.square = {};

        this.lines = [];
        this.linePosition = 0;
        this.endPosition = 0;
        this.ends = [];

        
        this.halfPI = Math.PI / 2;
        this.quarterPI = Math.PI / 4;
        this.doublePI = Math.PI * 2;

        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.animationFrameId = null;
        this.observer = '';
    }

    generatePCB() {
        if (this.autoResize) {
            this.observer = new ResizeObserver(this.makePCB.bind(this));
            this.observer.observe(this.canvas)
        }
            // window.addEventListener('resize', this.makePCB.bind(this), true);
        this.makePCB();
    }

    stopPCB() {
        this.observer.disconnect()
        cancelAnimationFrame(this.animationFrameId);
    }

    makePCB() {
        this.linePosition = 0;
        this.endPosition = 0;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        this.lines.length = 0;
        this.ends.length = 0;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.squareSize = this.autoFitSizes ? ((this.width < this.height ? this.width : this.height) / 3) : this.squareSize;

        let posx = 0;
        let posy = 0;
        switch (this.location) {
            case "Center":
                posx = (this.width - this.squareSize) / 2;
                posy = (this.height - this.squareSize) / 2;
                break;
            case "HalfLeft":
                posx = -(this.squareSize) / 2;
                posy = (this.height - this.squareSize) / 2;
                break;
            case "HalfRight":
                posx = (this.width - this.squareSize / 2);
                posy = (this.height - this.squareSize) / 2;
                break;
            case "HalfTop":
                posx = (this.width - this.squareSize) / 2;
                posy = -(this.squareSize) / 2;
                break;
            case "HalfBottom":
                posx = (this.width - this.squareSize) / 2;
                posy = (this.height - this.squareSize / 2);
                break;
            case "AutoRightBottom":
                if (this.width >= this.height) {
                    posx = (this.width - this.squareSize) * 3 / 4;
                    posy = (this.height - this.squareSize) / 2;
                } else {
                    posx = (this.width - this.squareSize) / 2;
                    posy = (this.height - this.squareSize) * 3 / 4;
                }
                break;
            case "AutoLeftTop":
                if (this.width >= this.height) {
                    posx = (this.width - this.squareSize) * 1 / 4;
                    posy = (this.height - this.squareSize) / 2;
                } else {
                    posx = (this.width - this.squareSize) / 2;
                    posy = (this.height - this.squareSize) * 1 / 4;
                }
                break;
            case "HalfRightBottom":
                if (this.width >= this.height) {
                    posx = (this.width - this.squareSize / 2);
                    posy = (this.height - this.squareSize) / 2;
                } else {
                    posx = (this.width - this.squareSize) / 2;
                    posy = (this.height - this.squareSize / 2);
                }
                break;
            case "HalfLeftTop":
                if (this.width >= this.height) {
                    posx = -(this.squareSize) / 2;
                    posy = (this.height - this.squareSize) / 2;
                } else {
                    posx = (this.width - this.squareSize) / 2;
                    posy = -(this.squareSize) / 2;
                }
                break;
            case "Custom":
                posx = this.CustomPosX;
                posy = this.CustomPosY;
                break;
        }

        this.square = { x: posx, y: posy, size: this.squareSize };
        this.ctx.lineWidth = this.autoFitSizes ? (Math.floor(((this.width < this.height ? this.width : this.height) * 2) / 1000)) : this.lineWidth ;
        this.lineSpacing = this.autoFitSizes ? (8 + this.ctx.lineWidth * 2) : this.lineSpacing;
        this.createLinesFromEdges();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(this.square.x, this.square.y, this.square.size, this.square.size);
        this.animate();
    }

    drawLine(line) {
        this.ctx.beginPath();
        this.ctx.moveTo(line.x1, line.y1);
        this.ctx.lineTo(line.x2, line.y2);
        this.ctx.stroke();
    }

    drawCircles(circle) {
        this.ctx.beginPath();
        this.ctx.arc(circle.x, circle.y, 2, 0, this.doublePI);
        this.ctx.stroke();
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    createLinesFromEdges() {
        const numLinesPerEdge = Math.floor(this.square.size / this.lineSpacing);
        this.numEnds = (numLinesPerEdge - 1) * 4;

        for (let i = 1; i < numLinesPerEdge; i++) {
            let x1 = this.square.x + i * this.lineSpacing;
            let y1 = this.square.y;
            this.lines.push({ x1, y1, x2: x1, y2: y1 - this.lineSpeed, angle: -this.halfPI, length: 0, lastAngle: -1 });
        }

        for (let i = 1; i < numLinesPerEdge; i++) {
            let x1 = this.square.x + this.square.size;
            let y1 = this.square.y + i * this.lineSpacing;
            this.lines.push({ x1, y1, x2: x1 + this.lineSpeed, y2: y1, angle: 0, length: 0, lastAngle: -1 });
        }

        for (let i = 1; i < numLinesPerEdge; i++) {
            let x1 = this.square.x + i * this.lineSpacing;
            let y1 = this.square.y + this.square.size;
            this.lines.push({ x1, y1, x2: x1, y2: y1 + this.lineSpeed, angle: this.halfPI, length: 0, lastAngle: -1 });
        }

        for (let i = 1; i < numLinesPerEdge; i++) {
            let x1 = this.square.x;
            let y1 = this.square.y + i * this.lineSpacing;
            this.lines.push({ x1, y1, x2: x1 - this.lineSpeed, y2: y1, angle: Math.PI, length: 0, lastAngle: -1 });
        }
    }

    updateLine(line) {
        let oldAngle = line.angle;
        if (line.length >= this.minLength && Math.random() < 0.008) {
            const randomAngle = (Math.random() < 0.5 ? 1 : -1) * this.quarterPI;
            line.angle += randomAngle;
        }
        const newX2 = line.x2 + this.lineSpeed * Math.cos(line.angle);
        const newY2 = line.y2 + this.lineSpeed * Math.sin(line.angle);
        if (line.angle != oldAngle) {
            line.lastAngle = oldAngle;
        }
        if (Math.random() > this.endCoefficient || line.length <= this.minLength / 2) {
            if (!this.checkCollision(newX2, newY2)) {
                this.lines.push({ x1: line.x2, y1: line.y2, x2: newX2, y2: newY2, angle: line.angle, length: line.length + this.lineSpeed, lastAngle: line.lastAngle });
            } else {
                this.lines.push({ x1: line.x2, y1: line.y2, x2: newX2, y2: newY2, angle: line.lastAngle, length: line.length + this.lineSpeed, lastAngle: line.lastAngle });
            }
        } else {
            let x = line.x2;
            if (Math.random() > 0.5) x += 1;
            else x -= 1;
            let y = line.y2;
            if (Math.random() > 0.5) y += 1;
            else y -= 1;
            this.ends.push({ x: x, y: y });
        }
        line.finished = true;
    }

    checkCollision(x2, y2) {
        for (let line of this.lines) {
            if (Math.hypot(x2 - line.x2, y2 - line.y2) < 2) {
                return true;
            }
        }
        return false;
    }

    animate() {
        if (this.linePosition == this.lines.length && this.endPosition == this.ends.length) cancelAnimationFrame(this.animationFrameId);

        this.lines.forEach(line => {
            if (!line.finished) {
                this.updateLine(line);
            }
        });
        this.lines.slice(this.linePosition, this.lines.length).forEach(line => this.drawLine(line));

        this.linePosition = this.lines.length;

        this.ends.slice(this.endPosition, this.ends.length).forEach(circle => this.drawCircles(circle));

        this.endPosition = this.ends.length;

        this.ctx.clearRect(this.square.x + 1, this.square.y + 1, this.square.size - 2, this.square.size - 2);
        if (this.numEnds > this.ends.length) this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }
}
