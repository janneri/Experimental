// Copyright Antti "lokori" Virtanen 2012.

var canvas = null;
var context = null;
var canvasData = null;
var index = null;
var averageVal = null;
var lampotilaRange = null;
var lampotilat = null;

window.onload = init;

function init()
{
    lampotilaRange = new Array(256);

    var green = 0;
	for (var i = 0; i < 256; i++) {    	
		var red = i*2;
		if ( i > 256 ) {
			red = 256
		}  
		
		if ( i > 100) {
			green = green + 2
		}  
		
		var triplet = {
    			r: red,
    			g: green,
    			b: 0
    	};
    	lampotilaRange[i] = triplet; 
    }

	canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    lampotilat = new Array(canvasData.width*canvasData.height);
    
    clear(canvasData, 0, 0, 0, 255);
    
    draw();
    setInterval(draw, SECONDSBETWEENFRAMES * 1000);
    renderInProgress = false;
    
}

// target frames per second
const FPS = 28;
const SECONDSBETWEENFRAMES = 1 / FPS;
var currentFrame = 4;
var renderInProgress = true;

function draw()
{
    currentFrame = currentFrame + 1;
    if (!renderInProgress) {
      renderInProgress = true;
      pikseloi();
      context.putImageData(canvasData, 0, 0);
      fpsTimer.refreshFps();
      renderInProgress = false;
    }
    
    context.font="16px bold sans-serif";
    context.fillStyle="#ff0000";
    context.fillText(" fps " + fpsTimer.getFps(), 300, canvasData.height-30);
    
    drawRange();
    
}

function drawRange()
{
    for (var i = 0; i < 256; i++) {
    	var t = lampotilaRange[i];
    	context.fillStyle = "rgb(" + t.r + "," + t.g + "," + t.b + ")"
    	context.fillRect(i, 0, 1, 10);
    }
	
}

function lampotila(x, y) {
	
	averageVal = 
		(getData(x, y, 0) +
	    getData(x-1, y+1, 0) +
	    getData(x, y+1, 0) +
	    getData(x+1, y+1, 0)) >> 2;
	
	return averageVal;
}

function getData(x, y, defaultIfNotExists) {
	var index = (canvasData.width*y + x) << 2; // TODO: ei vain R vaan erillinen taulukko
	if ( x < 0 || x >= canvasData.width || index > canvasData.data.length ) {
		return defaultIfNotExists
	}
	return canvasData.data[index]
}

function pikseloi() {
	index = 0
	
    for (var y=0; y < canvasData.height-1; y++) {
    	for (var x=0; x < canvasData.width; x++) {    		
    		var l = lampotila(x, y);
    		putpixelFast(l,0,0); // TODO: G and B
    		++index
    	}
    }
    
    for (var x=0; x < canvasData.width; x++) {

    	var i = Math.floor(Math.random() * 255);
    	var lampo = lampotilaRange[i];
    	
    	lampotilat[(y+x)*4] = i;
    	
		putpixelFast(lampo.r, lampo.g, lampo.b);
    }

}

function putpixelFast(r,g,b) {
    canvasData.data[index] = r;
    canvasData.data[++index] = g;
    canvasData.data[++index] = b;
    ++index;
}


function putpixel(x,y,r,g,b) {
	index = (canvasData.width*y + x) << 2
    canvasData.data[index] = r;
    canvasData.data[++index] = g;
    canvasData.data[++index] = b;
}

function clear(canvasData,r,g,b,a) {
    var ti = canvasData.width*canvasData.height*4;
    do {
		canvasData.data[--ti] = a;
		canvasData.data[--ti] = b;
		canvasData.data[--ti] = g;
		canvasData.data[--ti] = r;
    } while (ti > 0);
}

