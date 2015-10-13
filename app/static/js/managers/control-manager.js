define(["controlService"], function(ControlServiceModule){
    function ControlManager(){
        var self = this;

        self._ = {
            disposed: false,
            controlService: ControlServiceModule.get()
        }

        self.getControl = function(name){
            return self._.controlService.getControl(name);
        }

        self.dispose = function(){
            if(!self._.disposed){
                
                self._.controlService.dispose();
                self._.controlService = null;

                self._.disposed = true;
            }
        }
    }

    return {
        get: function(){
            return new ControlManager();
        },
        type: function(){
            return ControlManager;
        }
    }
});
