define(["module", "chain"], function(module, chain){


    function ModuleInfo(name, type){
        var self = this;
        self.name = name;
        self.type = type
        self.module = null;
        self.loaded = false;
        self.initialized = false;
        self.started = false;
    }

    function ModuleService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            loading: false,
            config: module.config(),
            pluginPrefix: "modular!",
            modules: [],

            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("ModuleService must be initialized before being used.");
                }
            },
            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("ModuleService must be started before being used.");
                }
            },
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("ModuleService has already been disposed.");
                }
            },
            checkAll: function(){
                self._.checkIfDisposed();
                self._.checkIfInitialized();
                self._.checkIfStarted();
            },
            getModule: function(name){
                for(var x=0; x<self._.modules.length; x++){
                    if(self._.modules[x].name == name){
                        return self._.modules[x];
                    }
                }
                return null;
            },
            loadListOfModules: function(context, abort, next){
                if(context.notLoadedModules.length > 0){
                    var moduleToLoad = context.notLoadedModules.pop();
                    self.loadModule(moduleToLoad.name, function(module){
                        context.loadedModules.push(module)
                        next(context);
                    })
                    context.chain.cc(self._.loadListOfModules);
                }
                else{
                    next(context);
                }
            }
        };

        self.init = function(){
            self._.checkIfDisposed();
            if(!self._.initialized){
                self._.initialized = true;

                var modules = self._.config["modules"];
                for(var x=0; x<modules.length; x++){
                    self.registerModule(modules[x].name, modules[x].type);
                }
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

        self.dispose = function(){
            if(!self._.disposed){
                self._.disposed = true;
            }
        };

        self.registerModule = function(name, type){
            self._.checkIfDisposed();
            if("string" !== typeof name) throw new Error("ModuleService.registerModule: invalid module name.")
            for(var x=0; x<self._.modules.length; x++){
                if(self._.modules[x].name === name){
                    return;
                }
            }
            self._.modules.push(new ModuleInfo(name, type));

        };

        self.deregisterModule = function(name){
            self._.checkAll();
            if("string" !== typeof name) throw new Error("ModuleService.deregisterModule: invalid module name.")
            var module = self._.getModule(name);
            if(module.started) throw new Error("ModuleService.deregisterModule: cannot deregister started module. Stop module first.");
            self._.modules.remove(module);
        };

        self.loadModule = function(name, callback){
            if("string" !== typeof name) throw new Error("ModuleService.loadModule: invalid module name.")
            var module = self._.getModule(name);

            if(!self._.loading && !module.loaded){
                if(module === null) throw new Error("ModuleService.loadModule: failed to find registered module with the name: '" + name + "'.");
                if(module.loaded) throw new Error("ModuleService.loadModule: module with the name: '" + name + "' is already loaded.");

                self._.loading = true;

                require([self._.pluginPrefix + module.name], function(loadedModule){
                    module.module = loadedModule;
                    module.loaded = true;
                    self._.loading = false;
                    callback(loadedModule);
                });
            }
            else{
                setTimeout(function(){
                    self.loadModule(name, callback);
                }, 50);
            }

        };

        self.unloadModule = function(name){
            if("string" !== typeof name) throw new Error("ModuleService.unloadModule: invalid module name.")

            var module = self._.getModule(name);
            if(module === null) throw new Error("ModuleService.unloadModule: failed to find registered module with the name: '" + name + "'.");
            if(!module.loaded) throw new Error("ModuleService.unloadModule: module with the name: '" + name + "' is already loaded.");
            if(module.started) throw new Error("ModuleService.unloadModule: module with the name: '" + name + "' is already started.");
            module.module = null;
        };

        self.initModule = function(name){
            if("string" !== typeof name) throw new Error("ModuleService.initModule: invalid module name.")

            var module = self._.getModule(name);
            if(module === null) throw new Error("ModuleService.initModule: failed to find registered module with the name: '" + name + "'.");
            if(!module.loaded) throw new Error("ModuleService.initModule: failed to initialize module with the name: '" + name + "' as it has not been loaded.");

            module.module.init();
            module.initialized = true;

        };

        self.startModule = function(name){
            if("string" !== typeof name) throw new Error("ModuleService.startModule: invalid module name.")
            var module = self._.getModule(name);
            if(module === null) throw new Error("Moduleservice.startModule: failed to find registered module with the name: '" + name + "'.");
            if(!module.loaded) throw new Error("ModuleService.startModule: failed to start module with the name: '" + name + "' as it has not been loaded.");
            if(!module.initialized) throw new Error("ModuleService.startModule: failed to start module with the name: '" + name + "' as it has not been initialized.");
            module.module.start()    
            module.started = true;
        };

        self.stopModule = function(name){
            if("string" !== typeof name) throw new Error("ModuleService.stopModule: invalid module name.")
            var module = self._.getModule(name);
            if(module === null) throw new Error("Moduleservice.stopModule: failed to find registered module with the name: '" + name + "'.");
            if(!module.loaded) throw new Error("ModuleService.stopModule: failed to start module with the name: '" + name + "' as it has not been loaded.");
            if(!module.started) throw new Error("ModuleService.stopModule: failed to stop module with the name: '" + name + "' as it has not been started.");
        };

        self.loadModulesOfType = function(type, callback){
            if("string" !== typeof type) throw new Error("ModuleService.loadModulesOfTyope: invalid module type.")

            var notLoadedModules = [];
            for(var x=0; x<self._.modules.length; x++){
                if(self._.modules[x].type == type){
                    notLoadedModules.push(self._.modules[x]);
                }
            }

            chain.get()
                .cc(self._.loadListOfModules)
                .end({
                    loadedModules: [],
                    notLoadedModules: notLoadedModules
                },
                function(context){
                    callback(context.loadedModules);
                });
        };

        self.initModulesOfType = function(type){
            if("string" !== typeof type) throw new Error("ModuleService.initModulesOfTyope: invalid module type.")
            for(var x=0; x<self._.modules.length; x++){
                if(self._.modules[x].type == type){
                    self.initModule(self._.modules[x].name);
                }
            }
        };

        self.startModulesOfType = function(type){
            if("string" !== typeof type) throw new Error("ModuleService.startModulesOfTyope: invalid module type.")
            for(var x=0; x<self._.modules.length; x++){
                if(self._.modules[x].type == type){
                    if(self._.modules[x].initialized && !self._.modules[x].started){
                        self._.modules[x].module.start();
                        self._.modules.started = true;
                    }
                }
            }
        };

        self.stopModulesOfType = function(type){
            if("string" !== typeof type) throw new Error("ModuleService.stopModulesOfTyope: invalid module type.")
            for(var x=0; x<self._.modules.length; x++){
                if(self._.modules[x].type == type){
                    if(self._.modules[x].started){
                        self._.modules[x].module.stop();
                        self._.modules.started = false;
                    }
                }
            }
        };

        self.getModule = function(name){
            var mod = self._.getModule(name);
            if(mod == null) throw new Error("ModuleService.getModule: module with name '" + name+ "' does not exsist.");
            if(!mod.loaded) throw new Error("ModuleService.getModule: module with name '" + name+ "' is not loaded.");
            if(!mod.initialized) throw new Error("ModuleService.getModule: module with name '" + name + "' is not initialized.");
            if(!mod.started) throw new Error("ModuleService.getModule: module with name '" + name + "' has not been started.");

            return mod.module;
        }

        self.getModulesOfType = function(type){
            var modules = [];
            for(var x=0; x<self._.modules.length; x++){
                var mod = self._.modules[x]; 
                if(mod.type == type){
                    if(!mod.loaded) throw new Error("ModuleService.getModule: module with name '" + mod.name + "' and type '" + mod.type + "' is not loaded.");
                    if(!mod.initialized) throw new Error("ModuleService.getModule: module with name '" + mod.name + "' and type '" + mod.type + "' is not initialized.");
                    if(!mod.started) throw new Error("ModuleService.getModule: module with name '" + mod.name + "' and type '" + mod.type + "' has not been started.");
                    modules.push(mod);
                }
            }
            return modules;
        }
    }

    return {
        get: function(){
            return new ModuleService();
        },
        type: function(){
            return ModuleService;
        }
    };

});
