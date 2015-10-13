define(["filterService"], function(FilterServiceModule){
    
    function FilterManager(){
        var self = this;
        
        self._ = {
            disposed: false,
            filterService: FilterServiceModule.get(),
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("FilterManager has already been disposed.");
                }
            }
        };

        self.getFilters = function(){
            self._.checkIfDisposed();
            return self._.filterService.filters();
        };

        self.subscribeFilters = function(callback){
            return self._.filterService.subscribeFilters(callback);
        }

        self.dispose = function(){
            if(!self._.disposed){

                self._.filterService.dispose();
                self._.filterService = null;

                self._.disposed = true;
            }
        }
    }

    return {
        get: function(){
            return new FilterManager();
        },
        type: function(){
            return FilterManager;
        }
    }

});
