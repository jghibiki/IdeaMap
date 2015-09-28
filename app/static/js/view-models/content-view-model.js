define(["ko", "mapManager"], function(ko, MapManagerModule){

    function ContentViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            mapManager: MapManagerModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("ContentViewModel has already been disposed.");
                }
            }
        }

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){

                self._.mapManager.SetMapTarget("map");

                self._.shown = true;
            }
        }

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                self._.mapManager.SetMapTarget(null);

                self._.shown = false;
            } 
        }

        self.dispose = function(){
            if(!self._.disposed){
                self.hidden();
                self._.disposed = true;
            }
        }
    }

    return {
        get: function(){
            return new ContentViewModel();
        },
        type: function(){
            return ContentViewModel;
        }
    };
});
