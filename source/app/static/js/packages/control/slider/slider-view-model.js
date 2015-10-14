define(["ko"], function(ko){
	
    function SliderViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,

            checkIfShown: function(){
                if(!self._.shown){
                    throw new Error("This SliderViewModel must be showing before it can be used.");
                }   
            },
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("This SliderViewModel has already been disposed.");
                }
            }
        };

        self.value = ko.observable(0);

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.shown = true;
            }
        }

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                self._.shown = false;
            }
        }

        self.dispose = function(){
            if(!self._.disposed){
                self.hidden();
                self._.disposed = true;
            }
        }
    }

    return {
        get: function(){
            return new SliderViewModel(); 
        },
        type: function(){
            return SliderViewModel;
        }
    };
});
