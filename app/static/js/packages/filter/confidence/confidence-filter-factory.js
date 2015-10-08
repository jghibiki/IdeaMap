define(["confidenceFilter"], function(ConfidenceFilterModule){
    
	function ConfidenceFilterFactory(){
		var self = this;

		self._ = {
			disposed: false,
			confidenceFilterModule: ConfidenceFilterModule,

			checkIfDisposed: function(){
				if(self._.disposed){
					throw new Error("ConfidenceFilterFactory has already been disposed.");
				}
			}
		};

		self.getNew = function(){
			self._.checkIfDisposed();
			return self._.confidenceFilterModule.get();
		};

        self.friendlyName = "Confidence Filter"

        /* Fulfill module service contract*/
        self.init = function(){};
        self.start = function(){};
        self.stop = function(){};


		self.dispose = function(){
			if(!self._.disposed){
				self._.confidenceFilterModule = null;
				self._.disposed = true;
			}
		};
	}	

	return {
		get: function(){
			return new ConfidenceFilterFactory();
		},
		type: function(){
			return ConfidenceFilterFactory;
		}
	}
});
