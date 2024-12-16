const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Новый размер холста и масштаб
const canvasSize = 800;
const scaleFactor = canvasSize / 600;

// Исходные данные, масштабируемые автоматически
let segments = [
    {x1: 50, y1: 50, x2: 200, y2: 200},
    {x1: 100, y1: 100, x2: 300, y2: 100},
    {x1: 50, y1: 150, x2: 300, y2: 150}
].map(segment => ({
    x1: segment.x1 * scaleFactor,
    y1: segment.y1 * scaleFactor,
    x2: segment.x2 * scaleFactor,
    y2: segment.y2 * scaleFactor
}));

let windowBounds = {
    xmin: 100 * scaleFactor,
    ymin: 100 * scaleFactor,
    xmax: 250 * scaleFactor,
    ymax: 200 * scaleFactor
};

function drawSegments() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    segments.forEach(segment => {
        ctx.beginPath();
        ctx.moveTo(segment.x1, segment.y1);
        ctx.lineTo(segment.x2, segment.y2);
        ctx.stroke();
    });
}

function drawWindow() {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.rect(windowBounds.xmin, windowBounds.ymin, windowBounds.xmax - windowBounds.xmin, windowBounds.ymax - windowBounds.ymin);
    ctx.stroke();
}

function midpointClip(segment, bounds) {
    let {x1, y1, x2, y2} = segment;
    const {xmin, ymin, xmax, ymax} = bounds;

    function inside(x, y) {
        return x >= xmin && x <= xmax && y >= ymin && y <= ymax;
    }

    if (inside(x1, y1) && inside(x2, y2)) {
        return [segment];
    }

    let visibleSegments = [];

    function clipEdge(x1, y1, x2, y2) {
        if (x1 < xmin) {
            let t = (xmin - x1) / (x2 - x1);
            y1 += t * (y2 - y1);
            x1 = xmin;
        }
        if (x1 > xmax) {
            let t = (xmax - x1) / (x2 - x1);
            y1 += t * (y2 - y1);
            x1 = xmax;
        }
        if (y1 < ymin) {
            let t = (ymin - y1) / (y2 - y1);
            x1 += t * (x2 - x1);
            y1 = ymin;
        }
        if (y1 > ymax) {
            let t = (ymax - y1) / (y2 - y1);
            x1 += t * (x2 - x1);
            y1 = ymax;
        }
        return {x1, y1};
    }

    if (!inside(x1, y1)) {
        let result = clipEdge(x1, y1, x2, y2);
        x1 = result.x1;
        y1 = result.y1;
    }

    if (!inside(x2, y2)) {
        let result = clipEdge(x2, y2, x1, y1);
        x2 = result.x1;
        y2 = result.y1;
    }

    visibleSegments.push({x1, y1, x2, y2});
    return visibleSegments;
}

function clipAllSegments() {
    let clippedSegments = [];
    segments.forEach(segment => {
        clippedSegments = clippedSegments.concat(midpointClip(segment, windowBounds));
    });
    segments = clippedSegments;
    drawScene();
}

function drawScene() {
    drawSegments();
    drawWindow();
}

drawScene();

document.getElementById('clipButton').addEventListener('click', clipAllSegments);
