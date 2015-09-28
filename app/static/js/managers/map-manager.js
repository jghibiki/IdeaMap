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


        self.SetMapTarget = function(target){
            self._.mapService.SetMapTarget(target);
        }

        self.GetMapTarget = function(){
            return self._.mapService.GetMapTarget();
        }

        self.RemoveLayer = function(title){
            self._.mapService.RemoveLayer(title);
        }

        self.AddLayer= function(layer){
            self._.mapService.AddLayer(layer);
        }

		self.Subscribe = function(ev, callback){
			return self._.mapService.Subscribe(ev, callback);
		}

		self.Unsubscribe = function(key){
			self._.mapService.Unsubscribe(key);
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
