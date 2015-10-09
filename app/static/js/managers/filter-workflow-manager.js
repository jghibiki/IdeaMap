define(["filterWorkflowService"], function(FilterWorkflowServiceModule){
    
    function FilterWorkflowManager(){
        var self = this;

        self._ = {
            disposed: false,
            filterWorkflowService: FilterWorkflowServiceModule.get()
        }

        self.addFilter = function(filter){
            self._.filterWorkflowService.addFilter(filter);
        }
        
        self.removeFilter = function(filter){
            self._.filterWorkflowService.removeFilter(filter);
        }

        self.subscribeFilterSteps = function(callback){
            return self._.filterWorkflowService.subscribeFilterSteps(callback);
        }

        self.dispose = function(){
            if(!self._.disposed){
                
                self._.filterWorkflowService.dispose();
                self._.filterWorkflowService = null;

                self._.disposed = true;
            }
        }
    }

    return {
        get: function(){
            return new FilterWorkflowManager();
        },
        type: function(){
            return FilterWorkflowManager;
        }
    }

});
