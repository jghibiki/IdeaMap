define(["mapManager"], function(mapManagerModule){

	function SimpleDotsRenderer(){
		var self = this;

		self._ = {
			initialized: false,
			started: false,
			disposed: false,
			mapManager: mapManagerModule.get(),
			keys: [],

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

					var coords = null;
					if(tweet.coordinates !== null){
						coords = ol.proj.fromLonLat(tweet.coordinates.coordinates);
					}
					else if(tweet.place !== null){
						sumLat = 0;
						sumLon = 0;	
						for(var y=0; y<tweet.place.length; y++){
							var tempCoord = ol.proj.fromLonLat(tweet.place[y]);
							sumLon = sumLon + tempCoord[0];
							sumLat = sumLat + tempCoord[1];
						}

						var avgLon = sumLon/tweet.place.length;
						var avgLat = sumLat/tweet.place.length;

						coords = [avgLon, avgLat];
					}

					var geom = new ol.geom.Point(coords)
					var feature = new ol.Feature(geom);

					features.push(feature);

				}

				if("events" in data){	
					for(var x=0; x<data["events"].length; x++){
						var event = data["events"][x];
						var key = self._.mapManager.Subscribe(event[0], event[1]);
						self._.keys.push(key);
					}
				}
				
				var sourceVector = new ol.source.Vector({
					features: features
				});

				var layerVector = new ol.layer.Vector({
					title: "simple-dots",
					source: sourceVector
				});

				self._.mapManager.AddLayer(layerVector);
			}

			return function(){
				for(var x=0; x<self._.keys.length; x++){
					self._.mapManager.Unsubscribe(self._.keys[x]);
					self._.mapManager.RemoveLayer("simple-dots");
				}
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
