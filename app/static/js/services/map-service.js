define(["ko", "ol"], function(ko, ol){

    function MapService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            
            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("MapService must be initalized before being used or started.");
                }
            },
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("MapService has already been disposed.");
                }
            },
            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("MapService must be started before being used.");
                }
            },
            checkAll: function(){
                self._.checkIfDisposed();
                self._.checkIfInitialized();
                self._.checkIfStarted();
            }
        }

        self.map = null


        self.init = function(){
            self._.checkIfDisposed();
            if(!self._.initialized){

                var rootLayer = new ol.layer.Tile({
                    source: new ol.source.OSM(),
					title: "root"
                });

                self.map = new ol.Map({
                    layers:[rootLayer],
                    view: new ol.View({
                        center: [0 ,0],
                        zoom: 2,
                    })
                });

                self._.initialized = true;
            }
        }

        self.start = function(){
            self._.checkIfInitialized();
            self._.checkIfDisposed();
            if(!self._.started){



                self._.started = true;
            }
        };

        self.stop = function(){
            self._.checkIfInitialized();
            self._.checkIfDisposed();
            if(self._.started){
                self.started = false;
            }
        };

        self.disposed = function(){
            if(!self._.disposed){
                self._.stop();
                self._.disposed = true;
            }
        }

        
        self.GetMapTarget = function(){
            self._.checkAll();
            return self.map.getTarget();
        }
        
        self.SetMapTarget = function(target){
            self._.checkAll();
            return self.map.setTarget(target);
        }

        self.RemoveLayer = function(title){
            self._.checkAll();
            var layers = self.map.getLayers().getArray()
            for(var x=0; x<layers.length; x++){
                if(x !== 0 && layers[x].get('title') === title){
                    self.map.removeLayer(layers[x]);
                }    
            }
        };

        self.AddLayer = function(layer){
            self._.checkAll(); 
            self.map.addLayer(layer);
        }

		self.Subscribe = function(ev, callback){
			return self.map.on(ev, function(e){
				feature = self.map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
					return feature 
				})
				callback(feature);
			});
		}

		self.Unsubscribe = function(key){
			self.map.unByKey(key);
		}


    }

    return {
        get: function(){
            return new MapService();
        },
        type: function(){
            return MapService;
        }
    }
});
