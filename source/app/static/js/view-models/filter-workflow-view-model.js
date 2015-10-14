define(["ko", "filterWorkflowManager", "filterManager", "pipelineManager", "chain"], function(ko, FilterWorkflowManagerModule, FilterManagerModule, PipelineManagerModule, chain){
    
    function FilterWorkflowViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            filterWorkflowManager: FilterWorkflowManagerModule.get(),
            filterManager: FilterManagerModule.get(),
            pipelineManager: PipelineManagerModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("FilterWorkflowViewModel has already been disposed.");
                }
            }
        };

        self.state = ko.observable("filters");
        self.currentFilter = ko.observable(null);
        self.currentFilterListing = ko.observable(null);
        self.availableFilters = ko.observable();
        self.availableFiltersSubscription = null;
        self.filterSteps = ko.observable();
        self.filterStepsSubscription = null;

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                
            self.filterStepsSubscription = self._.filterWorkflowManager.subscribeFilterSteps(function(value){
                self.filterSteps(value);
            });


            self.availableFiltersSubscription = self._.filterWorkflowManager.subscribeAvailableFilters(function(value){
                self.availableFilters(value); 
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

        self.selectNewFilter = function(){
            self.state("selectNewFilter");
        }

        self.cancelSelectNewFilter = function(){
            self.state("filters");
        }

        self.createNewFilter = function(){
            self._.filterWorkflowManager.addFilter(this);
            self.state("filters");
        }

        self.editFilter = function(){
            self.currentFilter(this);
            self.currentFilterListing(this);
            self.state("editFilter");
        }

        self.submitEditFilter = function(){
            self.state("filters");
            self.currentFilter(null);
            self._.pipelineManager.forceRender();
        }

        self.removeCurrentFilter = function(){
            var filter = self.currentFilter();
            self._.filterWorkflowManager.removeFilter(filter);
            self.state("filters");
            self.currentFilter(null);
            self._.pipelineManager.forceRender();
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
