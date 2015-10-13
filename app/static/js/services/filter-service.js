define(["moduleManager", "chain", "ko"], function(ModuleManagerModule, chain, ko){
    
    function FilterService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            moduleManager: ModuleManagerModule.get(),

            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("FilterService needs to be initialized before it is used.");
                }
            },
            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("FilterService needs to be started before it is used.");
                }
            },
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("FilterService has already been disposed.");
                }
            }
        }

        self.filters = ko.observableArray();

        self.init = function(){
            self._.checkIfDisposed();
            if(!self._.initialized){
                self._.initialized = true;
            }
        }

        self.start = function(){
            self._.checkIfDisposed();
            self._.checkIfInitialized();
            if(!self._.started){
                chain.get()
                    .cc(function(context, abort, next){
                        self._.moduleManager.readyModulesOfType("filter", function(modules){
                            self.filters(modules);
                            next();
                        })
                    })
                    .end({},function(){
                        self._.started = true;
                    });
            }
        }

        self.subscribeFilters = function(callback){
            return self.filters.subscribe(callback);
        }

        self.stop = function(){
            if(self._.started){
                self._.started = false;
            }
        }

        self.dispose = function(){
            if(!self._.disposed){
                while(self.filters().length > 0){
                    var filter = self.filters.pop();
                    filter.dispose();
                    filer = null;
                }
                
                self._.moduleManager.dipose();
                self._.moduleManager = null;
                self._.disposed = false;
            }    
        }
    }

    return {
        get: function(){
            return new FilterService();
        },
        type: function(){
            return FilterService;
        }
    };
});
