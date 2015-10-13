define(["chain", "ko", "controlManager"], function(chain, ko, ControlManagerModule){
    
    function TextFilter(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,

            controlManager: ControlManagerModule.get(),


            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("This TextFilter must be initialized before it is used.");
                }
            },

            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("This TextFilter must be started before it is used.");
                }
            },

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("This TextFilter has already been disposed.");
                }
            },
            checkAll: function(){
                self._.checkIfDisposed();
                self._.checkIfInitialized();
                self._.checkIfStarted();
            }
        };
        
        self.friendlyName = ko.observable("Text Filter");
        self.controlType = "packages/control/text";
        self.control = null;
        self.controlSubscription = null;

        self.filter = function(tweets){
            self._.checkAll();
            var validTweets = [];
            for(var x=0 ; x<tweets.length; x++){
                if(tweets[x].text.indexOf(self.control.value()) > -1){
                    validTweets.push(tweets[x]);
                }
            }
            return validTweets;
        }

        self.init = function(){
            self._.checkIfDisposed(); 
            if(!self._.initialized){
                self._.initialized = true;

            }
        }

        self.start = function(){
            self._.checkIfDisposed();
            self._.checkIfInitialized();
            if(!self._.started){

                self.control = self._.controlManager.getControl(self.controlType);
                self._.started = true;
            }
        }

        self.stop = function(){
            self._.checkIfDisposed();
            self._.checkIfInitialized(); 
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
            return new TextFilter();
        },
        type: function(){
            return TextFilter; 
        }
    }

});
