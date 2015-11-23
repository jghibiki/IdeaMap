define(["ko", "mapManager", "popupViewModel"], function(ko, MapManagerModule, PopupViewModelModule){

    function ContentViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            mapManager: MapManagerModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("ContentViewModel has already been disposed.");
                }
            }
        }

	self.popupViewModel = PopupViewModelModule.get(),

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){

        		self.popupViewModel.shown();

                self._.shown = true;
            }
        }

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){

		self.popupViewModel.hidden();

                self._.shown = false;
            } 
        }

        self.dispose = function(){
            if(!self._.disposed){
                self.hidden();
		
		self.popupViewModel.dispose();
		self.popupViewModel = null;
		
		self._.mapManager.dispose();
		self._.mapManager = null;

                self._.disposed = true;
            }
        }
    }

    return {
        get: function(){
            return new ContentViewModel();
        },
        type: function(){
            return ContentViewModel;
        }
    };
});
