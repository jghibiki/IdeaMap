define(["ko", "leaflet"], function(ko, L){

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

                var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                });

                var map = L.map('map', {
                    scrollWheelZoom: true,
                    center: [39.09596, -101.95312],
                    zoom: 4
                });

                map.addLayer(layer);

                self.map = map;
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
        };

        self.addLayer = function(layer){
            self._.checkAll(); 
            self.map.addLayer(layer);
        };


        self.removeLayer = function(layer){
            self._.checkAll();
            self.map.removeLayer(layer);
        };

    	// self.registerOverlay = function(overlay){
    	// 	self.map.addOverlay(overlay);
    	// };

    	// self.deregisterOverlay = function(overlay){
    	// 	self.map.removeOverlay(overlay);
    	// }


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
