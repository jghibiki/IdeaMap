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

        self.readyModulesOfType = function(type, doneCallback){
            chain.get()
            .cc(function(context, abort, next){
                self._.moduleService.loadModulesOfType(context.type, function(modules){
                context.modules = modules;
                next(context);  
                });
            })
            .end({type: type, callback: doneCallback}, function(context){
                self._.moduleService.initModulesOfType(context.type);
                self._.moduleService.startModulesOfType(context.type);
                context.callback(context.modules);
            });
        };

        self.getModule = function(name){
            return self._.moduleService.getModule(name);
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

