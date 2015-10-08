define(["ko", "filterManager", "chain"], function(ko, FilterManagerModule, chain){
    
    function FilterWorkflowViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            timer: null,
            filterManager: FilterManagerModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("FilterWorkflowViewModel has already been disposed.");
                }
            }
        };

        self.filters = ko.observableArray();
        self.loading = ko.observable(false);

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                
                self._.timer = setInterval(function(){
                    var filters = self._.filterManager.getFilters();
                    if(filters.length > 0){
                        clearInterval(self._.timer);
                        self.filters(self._.filterManager.getFilters());
                        self.loading(false);
                    }
                }, 100);

            self._.shown = true;
            }
        }

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                self.shown = false;
            }
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
            return new FilterWorkflowViewModel();
        },
        type: function(){
            return FilterWorkflowViewModel;
        }
    }

});
