define(["mapManager", "leaflet"], function(mapManagerModule, L){

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


					if(tweet.classification === "pos"){
						feature = L.circleMarker(
							L.latLng(tweet.point.coordinates[1], tweet.point.coordinates[0]),
							{
								fill: true,
								fillColor: 'rgb(62,122,0)',
								fillOpacity: 0.6,

								stroke: true,
								color: '#3e7a00',
								weight: 1.25
							})
							.setRadius(7)
							.bindPopup("<p>" + tweet.original + "</p>");
					}
					else if (tweet.classification === "neg"){
						feature = L.circleMarker(
							L.latLng(tweet.point.coordinates[1], tweet.point.coordinates[0]),
							{
								fill: true,
								fillColor: 'rgb(122,0,0)',
								fillOpacity: 0.6,

								stroke: true,
								color: '#7a0001',
								weight: 1.25
							})
							.setRadius(7)
							.bindPopup("<p>" + tweet.original + "</p>");

					}

					features.push(feature);

				}

				//if("events" in data){	
				//	for(var x=0; x<data["events"].length; x++){
				//		var event = data["events"][x];
				//		var key = self._.mapManager.subscribe(event.event, event.callback);
				//		self._.keys.push(key);
				//	}
				//}
				

				var layerGroup = L.layerGroup(features);
				self._.mapManager.addLayer(layerGroup);
			}

			return function(){
				//for(var x=0; x<self._.keys.length; x++){
				//	self._.mapManager.unsubscribe(self._.keys[x]);
				//}
				self._.mapManager.removeLayer(layerGroup);
			};
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
