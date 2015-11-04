define(["regexFilter"], function(RegexFilterModule){
    
	function RegexFilterFactory(){
		var self = this;

		self._ = {
			disposed: false,
			regexFilterModule: RegexFilterModule,

			checkIfDisposed: function(){
				if(self._.disposed){
					throw new Error("RegexFilterFactory has already been disposed.");
				}
			}
		};

		self.getNew = function(){
			self._.checkIfDisposed();
			var filter = self._.regexFilterModule.get();
            filter.id = self.newGuid();
            return filter;
		};

        self.newGuid = function(){
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        }

        self.friendlyName = "Regular Expression Filter"

        /* Fulfill module service contract*/
        self.init = function(){};
        self.start = function(){};
        self.stop = function(){};


		self.dispose = function(){
			if(!self._.disposed){
				self._.regexFilterModule = null;
				self._.disposed = true;
			}
		};
	}	

	return {
		get: function(){
			return new RegexFilterFactory();
		},
		type: function(){
			return RegexFilterFactory;
		}
	}
});
