define(["mapManager", "ol"], function(mapManagerModule, ol){

	function SimpleDotsRenderer(){
		var self = this;

		self._ = {
			initialized: false,
			started: false,
			disposed: false,
			mapManager: mapManagerModule.get(),
			keys: [],
			redStyle: null,
			greenStyle: null,
			checkIfInitialized: function(){
				if(!self._.initialized){
					throw new Error("SimpleDotRenderer needs to be initialized before it can be used.");
				}
			},
			checkIfStarted: function(){
				if(!self._.started){
					throw new Error("SimpleDotRenderer needs to be started before it can be used.");
				}
			},
			checkIfDisposed: function(){
				if(self._.disposed){
					throw new Error("SimpleDotRenderer has already been disposed.");
				}
			},
			checkAll: function(){
				self._.checkIfDisposed();
				self._.checkIfInitialized();
				self._.checkIfStarted();
			}
		};	

		self.init = function(){
			if(!self._.initialized){
				self._.initialized = true;

				var redFill = new ol.style.Fill({
					color: 'rgba(122,0,0,0.6)'
				});
				var redStroke = new ol.style.Stroke({
						color: '#7a0001',
						width: 1.25
				});

				var greenFill = new ol.style.Fill({
					color: 'rgba(62,122,0,0.6)'
				});
				var greenStroke = new ol.style.Stroke({
						color: '#3e7a00',
						width: 1.25
				});


				self._.redStyle = new ol.style.Style({
					image: new ol.style.Circle({
					    fill: redFill,
					    stroke: redStroke,
					    radius: 7
					}),
					fill: redFill,
					stroke: redStroke	
				});
 
				self._.greenStyle = new ol.style.Style({
					image: new ol.style.Circle({
					    fill: greenFill,
					    stroke: greenStroke,
					    radius: 7
					}),
					fill: greenFill,
					stroke: greenStroke	
				});

			}
		};

		self.start = function(){
			self._.checkIfDisposed();
			self._.checkIfInitialized();
			if(!self._.started){
				self._.started = true;
			}
		};

		self.stop = function(){
			self._.checkAll();
			if(self._.started){
				self._.started = false;
			}
		};

		self.disposed = function(){
			if(!self._.disposed){
				self.stop();
				self._.disposed = true;
			}
		};

		self.render = function(data){
			/*
			 * Data:
			 * 	- tweets (required)
			 * 	- events (optional)
			 */
			if(!("tweets" in data)) throw new Error("SimpleDotRenderer requires tweets be defined.");
			var tweets = data["tweets"];
			var features = [];

			if(tweets !== null && tweets !== undefined){
				for(var x=0; x<tweets.length; x++){
					var tweet = tweets[x];	

					var geom = new ol.geom.Point(tweet.point.coordinates)
					var feature = new ol.Feature({
						geometry: geom,
					    	tweet: tweet
					});

					if(tweet.classification === "pos"){
						feature.setStyle(self._.greenStyle);
					}
					else if (tweet.classification === "neg"){
						feature.setStyle(self._.redStyle);
					}

					features.push(feature);

				}

				if("events" in data){	
					for(var x=0; x<data["events"].length; x++){
						var event = data["events"][x];
						var key = self._.mapManager.subscribe(event.event, event.callback);
						self._.keys.push(key);
					}
				}
				
				var sourceVector = new ol.source.Vector({
					features: features
				});

				var layerVector = new ol.layer.Vector({
					title: "red-green-dots",
					source: sourceVector
				});

				self._.mapManager.addLayer(layerVector);
			}

			return function(){
				for(var x=0; x<self._.keys.length; x++){
					self._.mapManager.unsubscribe(self._.keys[x]);
				}
				self._.mapManager.removeLayer("red-green-dots");
			}
		};
	}
	
	return {
		get: function(){
			return new SimpleDotsRenderer();
		},
		type: function(){
			return SimpleDotsRenderer;
		}
	}
});
