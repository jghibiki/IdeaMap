define(["ko", "mapService", "ol"], function(ko, MapServiceModule, ol){

    function MapManager(){
        var self = this;

        self._ = {
            disposed: false,
            mapService: MapServiceModule.get()
        }

        
        self.dispose = function(){
            if(!self._.disposed){
                self._.mapService.dispose();
                self._.mapService = null;

                self.disposed = true;
            }
        }


        self.setMapTarget = function(target){
            self._.mapService.setMapTarget(target);
        }

        self.getMapTarget = function(){
            return self._.mapService.getMapTarget();
        }

        self.removeLayer = function(title){
            self._.mapService.removeLayer(title);
        }

        self.addLayer= function(layer){
            self._.mapService.addLayer(layer);
        }

	self.subscribe = function(ev, callback){
		return self._.mapService.subscribe(ev, callback);
	}

	self.unsubscribe = function(key){
		self._.mapService.unsubscribe(key);
	}

	self.registerOverlay = function(overlay){
		self._.mapService.registerOverlay(overlay);
	}

	self.deregisterOverlay = function(overlay){
		self._.mapService.deregisterOverlay(overlay);
	}
    }

    return {
        get: function(){
            return new MapManager();
        },
        type: function(){
            return MapManager;
        }
    }


});
