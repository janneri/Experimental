var canvas = null;
var context = null;
var canvasData = null;
var kakka = null;
var lampoIdx = 0;
var averageVal = null;
var lampotilaRange = null;
var lampotilat = null;

window.onload = init;

function init()
{
    initLampotilaRange();

	canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
    lampotilat = new Array(canvasData.width*canvasData.height);
    
    clear(canvasData, 0, 0, 0, 255);
    
    draw();
    setInterval(draw, SECONDSBETWEENFRAMES * 1000);
    renderInProgress = false;
    
}

function initLampotilaRange()
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
}

function drawRange()
{
    for (var i = 0; i < 256; i++) {
    	var t = lampotilaRange[i];
    	context.fillStyle = "rgb(" + t.r + "," + t.g + "," + t.b + ")"
    	context.fillRect(i, 0, 1, 10);
    }	
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

function laskelampo(idx) {
	var averageVal =  
	  (lampotilat[idx] + 
	   getLampo(idx+canvasData.width-1) +
	   getLampo(idx+canvasData.width) + 
	   getLampo(idx+canvasData.width+1) ) >> 2; 
	   
	return averageVal;
}

function getLampo(i) {
	if ( i >= lampotilat.length )  {
		return 0;
	}
	return lampotilat[i];
}

function pikseloi() {
	kakka = 0;
	lampoIdx = 0;
	
	do {
	    var l = laskelampo(lampoIdx);
   	    lampotilat[lampoIdx] = l;
    	var lampo = lampotilaRange[l];
  	    putpixelFast(lampo.r, lampo.g, lampo.b);
  	    ++lampoIdx;
    } while (lampoIdx < lampotilat.length-1);
    
    for (var x=0; x < canvasData.width; x++) {

    	var i = Math.floor(Math.random() * 255);
    	lampotilat[(canvasData.height-1)*canvasData.width + x] = i;

    	var lampo = lampotilaRange[i];
		putpixelFast(lampo.r, lampo.g, lampo.b);
    }

}

function putpixelFast(r,g,b) {
    canvasData.data[kakka] = r;
    canvasData.data[++kakka] = g;
    canvasData.data[++kakka] = b;
    kakka = kakka+2;
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

