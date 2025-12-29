const canvas = document.getElementById('pcb-trace-canvas');
const pcb = new PCBTraceAnimation(canvas, {
    traceColor: '#00e6ff',
    viaColor: '#00e6ff',
    lineWidth: 3,
    speed: 3,
    lineSpacing:5
});

function fitCanvas() {
    pcb.initCanvas();
}

window.addEventListener('resize', fitCanvas);
fitCanvas();


pcb.drawLine(.35,.75,.30, true,false);
pcb.drawLine(.35,.25,.30, true,true);
pcb.drawLine(.65,.25,.50, false,false);
pcb.drawLine(.35,.25,.50, false,true);

pcb.start();