define(["moduleManager"], function(moduleManager){
    
    function ControlService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,

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

        self.start = function(){
            if(!self._.started){
                self._.started = true;
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

