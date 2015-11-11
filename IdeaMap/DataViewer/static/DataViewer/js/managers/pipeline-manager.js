define(["pipelineService"], function(PipelineServiceModule){
	
	function PipelineManager(){
		var self = this;

		self._ = {
			pipelineService: PipelineServiceModule.get()
		};

		self.registerEventListener = function(ev, callback){
			self._.pipelineService.registerEventListener(ev, callback);
		}

		self.deregisterEventListener = function(ev, callback){
			self._.pipelineService.deregisterEventListener(ev, callback);
		}

        self.forceRender = function(){
            self._.pipelineService._.beginPipeline(self._.pipelineService.tweets());
        }
	}	

	return {
		get: function(){
			return new PipelineManager();
		},
		type: function(){
			return PipelineManager();
		}
	}
});
