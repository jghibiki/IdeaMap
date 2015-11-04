define(["ko", "ol", "pipelineManager", "mapManager"], function(ko, ol, PipelineManagerModule, MapManagerModule){

	function PopupViewModel(){
		var self = this;

		self._ = {
			shown: false,
			disposed: false,
			pipelineManager: PipelineManagerModule.get(),
			mapManager: MapManagerModule.get(),
			container: null,
			closer: null,
			overlay: null,
			checkIfShown: function(){
				if(!self._.shown){
					throw new Error("PopupViewModel must be shown before it is used.");
				}
			},
			checkIfDisposed: function(){
				if(self._.disposed){
					throw new Error("PopupViewModel has already been disposed.");
				}
			},
			computeTweetText: function(tweet){
				if(tweet !== null && tweet !== undefined){
					var text = tweet.original;
					var hashtags = tweet.entities.hashtags;
					var users = tweet.entities.user_mentions;

					text = text.replace(/http(s?):\/\/t.co\/........../gi, function(url){
						return "<a href='" + url + "' target='_blank'>" + url + "</a>";
					});

					for(var x=0; x<hashtags.length; x++){
						text = text.replace("#" + hashtags[x].text, function(hashtag){

							tag = hashtag.replace("#", "");
							return "<a href='https://twitter.com/hashtag/" + tag + "' target='_blank'>" + hashtag + "</a>";
						});
					}

					for(var x=0; x<users.length; x++){
						text = text.replace("@" + users[x].screen_name, function(user){
							noAt = user.replace("@", "");
							return "<a href='https://twitter.com/" + noAt + "' target='_blank'>" + user + "</a>";
						})
					}

					text = "<p>" + text + "</p>";
					self.computedText(text);
				}
			},
			listTags: function(tweet){
				var tags = ""
				if(tweet !== null && tweet !== undefined){
				    for(var x=0; x< self.selectedTweet().entities.hashtags.length; x++){
					tags = (tags + "#" + tweet.entities.hashtags[x].text + " ");
				    }
				}
				if(tags === ""){
					return "No tags.";
				}
				else{ 
					return tags;
				}
			}
		};


		/* KO Objects */

		self.selectedTweet = ko.observable();
		self.computedText = ko.observable();
		self.selectedTweetTags = ko.observable();
		self.selectedTweetComputationSubscription = self.selectedTweet.subscribe(self._.computeTweetText);
		self.selectedTweetTagsSubscription = self.selectedTweet.subscribe(self._.listTags);
		/* View Model Contracts */

		self.shown = function(){
			if(!self._.shown){
				self._.shown = true;
				
				self._.container = document.getElementById("popup");
				self._.closer = document.getElementById("popup-closer");

				self._.overlay = new ol.Overlay({
					element: self._.container,
					offset: [7,0],
				});

				self._.mapManager.registerOverlay(self._.overlay);

				self._.pipelineManager.registerEventListener("singleclick", self.selectTweet);
			}
		};

		self.hidden = function(){
			if(self._.shown){
				self._.shown = false;

				self._.pipelineManger.deregisterEventListener("singleclick", self.selectTweet);
				self._.mapManager.deregisterOverlay(self._.overlay);
			}
		};

		self.dispose = function(){
			if(!self._.disposed){
				self._.disposed = true;
				self.hidden();

				self._.pipelineManager.dispose();
				self._.pipelineManager = null;

				self._.mapManager.dispose();
				self._.mapManager = null;
				
				self._.container = null;
				self._.popup = null;
				self._.closer = null;
			}
		};

		/* Callback Methods */

		self.selectTweet = function(context){
			if(context !== null 
			   && context !== undefined 
		           && context.feature !== undefined
			   && context.feature !== null){
				//self._.overlay.setPosition(context.event.coordinate);
				var tweet = feature.get('tweet');
				self._.overlay.setPosition(undefined);
				self.selectedTweet(undefined);
				self.selectedTweet(tweet);
				self._.overlay.setPosition(tweet.coordinates);
			}
		}

		self.clearSelectedTweet = function(){
		    self._.overlay.setPosition(undefined);
		    self.selectedTweet(null);
		}


	}
	
	return {
		get: function(){
			return new PopupViewModel();	
		},
		type: function(){
			return PopupViewModel;	
		}
	}
})
