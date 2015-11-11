define(["ko", "chain", "moduleManager"], function(ko, chain,  ModuleManagerModule){
    
    function ControlService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            moduleManager: ModuleManagerModule.get(),

            checkIfInitialized: function(){
                if(!self._.initlaized){
                    throw new Error("ControlService needs to be initialized before it is used.");
                }
            },
            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("ControlService needs to be started before it is used.");
                }
            },
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("ControlService has already been disposed.");
                }
            }
        }

        self.init = function(){
            if(!self._.initialized){
                self._.initialized = true;
            }
        }

        self.controls = ko.observableArray();

        self.start = function(){
            if(!self._.started){
                chain.get()
                    .cc(function(context, abort, next){
                        self._.moduleManager.readyModulesOfType("control", function(modules){
                            self.controls(modules);
                            next();
                        })
                    })
                    .end({},function(){
                        self._.started = true;
                    });
            }
        }

        self.stop = function(){
            if(self._.started){
                self._.started = false;
            }
        }

        self.dispose = function(){
            if(!self._.disposed){
                self._.started = false;
            }    
        }

        self.getControl = function(name){
            var controls = self.controls();
            for(var x=0; x<controls.length; x++){
                if(controls[x].type == name){
                    return controls[x].getNew();
                }
            }
        }
    }

    return {
        get: function(){
            return new ControlService();
        },
        type: function(){
            return ControlService;
        }
    };
});

