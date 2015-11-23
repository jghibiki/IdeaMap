define([], function(){
	var configName = "main";
	var bootstrapperName = "bootstrapper";

	return {
		load: function(moduleName, parentRequire, onLoad, config){
			
			moduleConfig = moduleName + "/" + configName;
			moduleBootstrapper = moduleName + "/" + bootstrapperName;	
			parentRequire([moduleConfig, moduleBootstrapper], function(rawConfig, rawBootstrapper){
				eval(rawConfig);
				eval(rawBootstrapper);

				parentRequire([moduleBootstrapper], function(mod){
					onLoad(mod);
				});	
			});
		}
	};
});
