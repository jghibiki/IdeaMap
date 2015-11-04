define(["ko", "filterManager"], function(ko, FilterManagerModule){


    function AvailableFilter(filter){
        var self = this;
        self.friendlyName = filter.friendlyName;
        self.module = filter;
    }
    
    function FilterWorkflowService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            filterManager: FilterManagerModule.get(),

            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("FilterWorkflowService must be initialized before it can be used.");
                }
            },
            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("FilterWorkflowService must be started before it can be used.");
                }
            },
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("FilterWorkflowService has already been disposed.");
                }
            }
        };

        self.availableFilters = ko.observable();
        self.availableFilterSubscription = null;
        self.steps = ko.observableArray(); 


        self.init = function(){
            self._.checkIfDisposed();
            if(!self._.initialized){
                self._.initialized = true;
            }
        };

        self.start = function(){
            self._.checkIfDisposed();
            self._.checkIfInitialized();
            if(!self._.started){
                
                self.availableFiltersSubscription = self._.filterManager.subscribeFilters(function(value){
                    var filters = [];
                    for(var x=0; x<value.length; x++){
                        filters.push(new AvailableFilter(value[x]));
                    }
                    self.availableFilters(filters);
                });
            
                self._.started = true;
            }   
        };

        self.stop = function(){
            self._.checkIfDisposed();
            self._.checkIfInitialized();
            if(self._.started){
                self._.started = false;
            }
        };

        self.addFilter = function(filter){
            var mod = filter.module.getNew();
            mod.init();
            mod.start();
            self.steps.push(mod);
        };

        self.removeFilter = function(filter){
            if(self.steps.indexOf(filter) !== -1){
                self.steps.remove(filter);
            } 
        }


        self.subscribeFilterSteps = function(callback){
            return self.steps.subscribe(callback);
        };

        self.subscribeAvailableFilters = function(callback){
            return self.availableFilters.subscribe(callback);
        }

        self.dispose = function(){
            if(!self._.disposed){
                
                self._.filterManager.dispose();
                self._.filterManager = null;

                self._.disposed = true;
            }   
        }
    }

    return {
        get: function(){
            return new FilterWorkflowService();
        },
        type: function(){
            return FilterWorkflowService;
        }
    }
     
});
