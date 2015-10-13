define(["textViewModel"], function(TextViewModelModule){
	function TextFactory(){
		var self = this;

		self._ = {
			disposed: false,
			textViewModelModule: TextViewModelModule,

			checkIfDisposed: function(){
				if(self._.disposed){
					throw new Error("TextFactory has already been disposed.");
				}
			}
		};

        self.type = "packages/control/text";

		self.getNew = function(){
			self._.checkIfDisposed();
			return self._.textViewModelModule.get();
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
			return new TextFactory();
		},
		type: function(){
			return TextFactory;
		}
	}
})
