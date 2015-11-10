define(["ko", "chain", "moduleManager", "module", "filterWorkflowManager"], function(ko, chain, ModuleManagerModule, module, FilterWorkflowManagerModule){
	function PipelineService(){
		var self = this;

		self._ = {
			initialized: false,
			started: false,
			disposed: false,
			loadTimer: null,
			loading: false,
			moduleManager: ModuleManagerModule.get(),
            filterWorkflowManager: FilterWorkflowManagerModule.get(),
			defaultRenderer: module.config()["defaultRenderer"],
			clearLayerCallback: null,

			checkIfInitialized: function(){
				if(!self._.initialized){
					throw new Error("SimpleDotRenderer needs to be initialized before it can be used.");
				}
			},
			checkIfStarted: function(){
				if(!self._.started){
					throw new Error("SimpleDotRenderer needs to be started before it can be used.");
				}
			},
			checkIfDisposed: function(){
				if(self._.disposed){
					throw new Error("SimpleDotRenderer has already been disposed.");
				}
			},
			checkAll: function(){
				self._.checkIfDisposed();
				self._.checkIfInitialized();
				self._.checkIfStarted();
			},

        	getTweets: function(){
				self._.checkIfDisposed();
				if(!self._.loading){
					self._.loading = true;
					chain.get()
					.cc(function(context, abort, next){
						console.log("Deleting expired tweets.");
						self.tweets([]);
						next();
					})
					.cc(function(context, abort, next){
						console.log("Loading new tweets.");
						$.ajax({
							url: "/api/tweets/?page=0",
							type: "GET",
							dataType: "json",
							success: function(response){
								context.response = response;
								next(context);
							},
							error: function(error){
								self._.loading = false;
								abort();
							}
						});
					})
					.cc(function(context, error, next){
						var json = context.response
						var features = []
						var tweets = [];
						for(var x=0; x< json["result"].length; x++){
							var tweet = json["result"][x];
							tweet.process_date = new Date(Date(tweet.process_date));

							/* fix coordinates */
							var coords = null;
							if(tweet.coordinates !== null){
								coords = ol.proj.fromLonLat(tweet.coordinates.coordinates);
							}
							else if(tweet.place !== null){
								sumLat = 0;
								sumLon = 0;	
								for(var y=0; y<tweet.place.length; y++){
									var tempCoord = ol.proj.fromLonLat(tweet.place[y]);
									sumLon = sumLon + tempCoord[0];
									sumLat = sumLat + tempCoord[1];
								}

								var avgLon = sumLon/tweet.place.length;
								var avgLat = sumLat/tweet.place.length;

								coords = [avgLon, avgLat];
							}
							
							tweet.coordinates = coords;
							tweets.push(tweet);
						}
						self.tweets(tweets);
						next();
					})
					.end({}, function(){
						self._.loading = false;
					});
				}
			},

			beginPipeline: function(tweets){
				chain.get()
					.cc(self._.clearLayers)
					.cc(self._.applyFilters)
					.cc(self._.generateRender)
					.end({
						tweets: tweets,
						events: self.listeners()
					})
			},

			clearLayers: function(context, abort, next){
				if(self._.clearLayerCallback !== null){
					self._.clearLayerCallback();
				}
				next(context);
			},

			applyFilters: function(context, abort, next){
                var tweets = context.tweets;
				for(var x=0; x<self.filters().length; x++){
					tweets = self.filters()[x].filter(tweets);
				}
                context.tweets = tweets;
				next(context);
			},

			generateRender: function(context, abort, next){
				self._.clearLayerCallback = self.renderer().render(context, self.listeners());
				next();	
			}
		};	

		/* Observables */
		self.tweets = ko.observable();
		self.filters = ko.observableArray();
		self.renderer = ko.observable();
		self.listeners = ko.observableArray();


		/* Tweets Subscription */
		self.tweetsSubscription = self.tweets.subscribe(function(value){
			self._.beginPipeline(value);
		});	

		/* Listeners Subscription */
		self.listenerSubscription = null;

		/* Service Contracts */
		self.init = function(){
			if(!self._.initialized){
				self._.initialized = true;

			}
		};

		self.start = function(){
			self._.checkIfDisposed();
			self._.checkIfInitialized();
			if(!self._.started){
				self._.started = true;

				chain.get()
					.cc(function(context, abort, next){
						self._.moduleManager.readyModule(self._.defaultRenderer, function(module){
                            context = { "module": module }
							next(context);
						});
					})
					.end({}, function(context){
						self.renderer(context.module);

						self._.getTweets();

                        self.filterSubscription = self._.filterWorkflowManager.subscribeFilterSteps(function(value){
                            self.filters(value);
                            setTimeout(function(){
                                self._.beginPipeline(self.tweets());
                            }, 1000);
                        });

						self.listenerSubscription = self.listeners.subscribe(function(value){
							self._.beginPipeline(self.tweets());
						});
						
						self._.loadTimer = setInterval(self._.getTweets, 60000);
					});

			}
		};

		self.stop = function(){
			self._.checkAll();
			if(self._.started){
				self._.started = false;
                clearTimer(self._.loadTimer);
			}
		};

		self.disposed = function(){
			if(!self._.disposed){
				self.stop();
				self._.disposed = true;
			}
		};



		/* Event Listeners */
		self.registerEventListener = function(ev, callback){
			self._.checkAll();
			for(var x=0; x<self.listeners().length; x++){
				var listener = self.listeners()[x];
				if("event" in listener && listener.event === ev &&  "callback" in listener && listener.callback === callback){
					return;	
				}
			}
			self.listeners.push({
				event: ev, 
				callback: callback
			});
		};

		self.deregisterEventListener = function(ev, callback){
			self._.checkAll();
			for(var x=0; x<self.listeners.length; x++){
				var listener = self.listeners[x];
				if(listener.event === ev && listener.callback === callback){
					self.listeners.remove(listener);
					break;
				}
			}
		};
	}

	return {
		get: function(){
			return new PipelineService();
		},
		type: function(){
			return PipelineService;
		}
	}
});

