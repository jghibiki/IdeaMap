define(["sliderViewModel"], function(SliderViewModelModule){
	function SliderFactory(){
		var self = this;

		self = {
			disposed: false,
			sliderViewModelModule: SliderViewModelModule,

			checkIfDisposed: function(){
				if(self._.disposed){
					throw new Error("SliderFactory has already been disposed.");
				}
			}
		};

		self.getNew = function(){
			self._.checkIfDisposed();
			return self._.sliderViewModelModule.get();
		}
        
        /* Module contracts */
        self.init = function(){}
        self.start = function(){}
        self.stop = function(){}

		self.dispose = function(){
			if(!self._.disposed){
				self._.slideViewModelModule = null;
				self._.disposed = true;
			}
		}
	}	

	return {
		get: function(){
			return new SliderFactory();
		},
		type: function(){
			return SliderFactory;
		}
	}
}
