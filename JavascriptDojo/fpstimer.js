var fpsTimer = (function() {
	var fps = 0, startTime=new Date(), now, lastUpdate = (new Date())*1 - 1;
	// The higher this value, the less the FPS will be affected by quick changes
	// Setting this to 1 will show you the FPS of the last sampled frame only
	var fpsFilter = 50;
	
	return { refreshFps: function() {
		var thisFrameFPS = 1000 / ((now=new Date()) - lastUpdate);
		fps += (thisFrameFPS - fps) / fpsFilter;
		lastUpdate = now;
	    },
		getFps: function() { return fps; },
		elapsed: function() { return ((new Date())-startTime); }
	}
 })();
