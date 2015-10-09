define(["ko", "filterManager"], function(ko, FilterManagerModule){

    function FilterStep(id, filterId, friendlyName){
        var self = this;
        self.id = id;
        self.filterId = id;
        self.friendlyName = ko.observable(friendlyName);         
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
            },
            newGuid: function(){
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                });
                return uuid;
            }
        };

        self.filters = [];
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
            self.steps.push(
                new FilterStep(
                    self._.newGuid(),
                    filter.guid,
                    filter.friendlyName
                )
            );
            self.filters.push(filter);
        };

        self.removeFilter = function(filter){
            if(self.filters.indexOf(filter) !== -1){
                self.filters.remove(filter);
            } 
            var steps = self.steps();
            for(var x=0; x<steps.length; x++){
                if(steps[x].filterId === filter.guid){
                    self.steps.splce(x, 1);
                    break;
                }
            }
        }

        self.subscribeFilterSteps = function(callback){
            return self.steps.subscribe(callback);
        };

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
