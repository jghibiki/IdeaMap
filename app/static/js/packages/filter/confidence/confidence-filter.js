define(["moduleManager", "chain"], function(ModuleManagerModule, chain){
    
    function ConfidenceFilter(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,

            moduleManager: ModuleManagerModule.get(),

            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("This ConfidenceFilter must be initialized before it is used.");
                }
            },

            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("This ConfidenceFilter must be started before it is used.");
                }
            },

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("This ConfidenceFilter has already been disposed.");
                }
            },
            checkAll: function(){
                self._.checkIfDisposed();
                self._.checkIfInitialized();
                self._.checkIfStarted();
            }
        };
        
        self.friendlyName = "Confidence Filter";
        self.controlType = "packages/control/slider";
        self.control = null;
        self.controlSubscription = null;

        self.filter = function(tweets){
            self._.checkAll();
            var validTweets = [];
            for(var x=0 ; x<tweets.length; x++){
                if(tweets[x].confidenceRating > self.control.value()){
                    validTweets.push(tweets[x]);
                }
            }
            return validTweets;
        }

        self.initialize = function(){
            self._.checkIfDisposed(); 
            if(!self._.initialied){
                self._.initialied = true;

            }
        }

        self.start = function(){
            self._.checkIfDisposed();
            self._.checkIfInitialied();
            if(!self._.started){

                chain.get()
                   .cc(function(context, abort, next){
                        self._.moduleManager.readyModule(self.controlType, function(module){
                            context = {"module" : module}
                            next(context);
                        }
                   })
                   .end({}, function(context){
                        self.control = context.module.get();
                        self._.started = true;
                   });

            }
        }

        self.stop = function(){
            self._.checkIfDisposed();
            self._.checkIfInitialied(); 
            if(self._.started){
                self._.started = false;
            }
        }

        self.disposed = function(){
            if(!self._.disposed){
                self._.stop();

                self._.moduleManager.dispose();
                self._.moduleManager = null;

                self.control.dispose();
                self.control = null;

                self._.disposed = true;
            }
        }

    }

    return {
        get: function(){
            return new ConfidenceFilter();
        },
        type: function(){
            return ConfidenceFilter; 
        }
    }

});
