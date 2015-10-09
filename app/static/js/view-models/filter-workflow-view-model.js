define(["ko", "filterWorkflowManager", "chain"], function(ko, FilterWorkflowManagerModule, chain){
    
    function FilterWorkflowViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            filterWorkflowManager: FilterWorkflowManagerModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("FilterWorkflowViewModel has already been disposed.");
                }
            }
        };

        self.filterSteps = ko.observable();
        self.filterStepsSubscription = null;

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                
            self.filterStepsSubscription = self._.filterWorkflowManager.subscribeFilterSteps(function(value){
                self.filterSteps(value);
            });

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
                
                self._.filterWorkflowManager.dispose();
                self._.filterWorkflowManager = null;

                self._.disposed = true;
            }
        }

        self.createStep = function(){
            alert("make select new step dialogue visible!")
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
