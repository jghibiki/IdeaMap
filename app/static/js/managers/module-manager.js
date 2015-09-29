define(["moduleService", "chain"], function(ModuleServiceModule, chain){
	
	function ModuleManager(){
		var self = this;

		self._ = {
			moduleService: ModuleServiceModule.get()
		};

		self.readyModule = function(name, doneCallback){
			chain.get()
				.cc(function(context, abort, next){
					self._.moduleService.loadModule(name, function(){
						next(context);
					});
				})
				.cc(function(context, abort, next){
					self._.moduleService.initModule(name);
					next(context);
				})
				.cc(function(context, abort, next){
					self._.moduleService.startModule(name);
					next(context);
				})
				.end({
					name: name
				}, function(context){
					var mod = self._.moduleService.getModule(name);
					doneCallback(mod);
				});
		};
	}	

	return {
		get: function(){
			return new ModuleManager();
		},
		type: function(){
			return ModuleManager();
		}
	}
});

