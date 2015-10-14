define(["chain", "ko", "controlManager"], function(chain, ko, ControlManagerModule){
    
    function RegexFilter(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,

            controlManager: ControlManagerModule.get(),


            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("This RegexFilter must be initialized before it is used.");
                }
            },

            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("This RegexFilter must be started before it is used.");
                }
            },

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("This RegexFilter has already been disposed.");
                }
            },
            checkAll: function(){
                self._.checkIfDisposed();
                self._.checkIfInitialized();
                self._.checkIfStarted();
            }
        };
        
        self.friendlyName = ko.observable("Regular Expression Filter");
        self.controlType = "packages/control/text";
        self.control = null;
        self.controlSubscription = null;

        self.filter = function(tweets){
            self._.checkAll();
            var validTweets = [];
            if(self.control.value() !== null || self.control.value() !== undefined || self.control.value() !== ""){
                for(var x=0 ; x<tweets.length; x++){
                        if(tweets[x].text.search(new RegExp(self.control.value(), 'i')) > -1){
                        validTweets.push(tweets[x]);
                    }
                }
                return validTweets;
            }
            else{
                return tweets;
            }
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
            return new RegexFilter();
        },
        type: function(){
            return RegexFilter; 
        }
    }

});
