define(["ko", "jquery", "chain", "ol", "pipelineManager"], function(ko, jquery, chain, ol, PipelineManagerModule){

    function SidePanelViewModel(){
        var self = this;

        self._ = {        
            shown: false,
            disposed: false,
            loading: false,
            loadTimer: null,
            pointsLayerTitle: "markers",
	    pipelineManager: PipelineManagerModule.get(),
            
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("SidePaneViewModel has already been disposed.");
                }
            },
            checkIfShown: function(){
                if(!self._.shown){
                    throw new Error("SidePaneViewModel must be showing before it can be used.");
                }
            }
        }

        self.selectedTweet = ko.observable()
	self.computedText = ko.computed(function(){
		if(self.selectedTweet() !== null && self.selectedTweet() !== undefined){
			var text = self.selectedTweet().original;
			var hashtags = self.selectedTweet().entities.hashtags;
			var users = self.selectedTweet().entities.user_mentions;

			//for(var x=0; x<urls.length; x++){
			//	var url = urls[x].url;
			//	text = text.replace(url, "<a href='" + url + "' target='_blank'>" + url + "</a>");
			//}
			
			text = text.replace(/http(s?):\/\/t.co\/........../, function(url){
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
			return text;
		}
	})

        self.selectedTweetTags = ko.computed(function(){
            /*
            if(self.selectedTweet() !== null && self.selectedTweet() !== undefined){
                var tags = ""
                for(var x=0; x< self.selectedTweet().entities.hashtags.length; x++){
                    tags = (tags + "#" + self.selectedTweet().entities.hashtags[x].text + " ");
                }
                return tags
            }
            return "No tags."
            */
        });

        self.polarityFilter = ko.observable()
        self.tagFilterRaw = ko.observable("")
        self.tagFilter = ko.computed(function(){
            /*
            if(self.tagFilterRaw() !== undefined 
                || self.tagFilterRaw() !== null){
                return self.tagFilterRaw().replace("#", "").replace(" ", "").split(",");
            }
            else{
                return null;
            }
            */
        })

        self.polarityFilterSubscription = self.polarityFilter.subscribe(function(value){
            /*
            for(var x=0; x < self.tweetFeatureMap.length; x++){
                if(value !== "both"){
                    if(self.tweetFeatureMap[x].tweet.classification !== value){
                        self.tweetFeatureMap[x].marker.setVisible(false);
                    }
                    if(self.tweetFeatureMap[x].tweet.classification === value){
                        self.tweetFeatureMap[x].marker.setVisible(true);
                    }
                }
                else{
                    self.tweetFeatureMap[x].marker.setVisible(true);
                }
            }
            */
        });

        self.tagFilterSubscription = self.tagFilter.subscribe(function(value){
            /*
            if(value !== null && value !== undefined && value.length > 0){
                for(var x=0; x<self.tweetFeatureMap.length; x++){
                    var hasTag = false;
                    for(var y=0; y<self.tweetFeatureMap[x].tweet.entities.hashtags.length; y++){
                        for(var z=0; z<value.length; z++){
                            if(self.tweetFeatureMap[x].tweet.entities.hashtags[y] === value[z]){
                                hasTag = true;
                                break;
                            }
                        }
                        if(hasTag){
                            break;
                        }
                    }
                    if(hasTag){
                        self.tweetFeatureMap[x].marker.setMap(self.map());
                    }
                    else{
                        self.tweetFeatureMap[x].marker.setMap(null);
                    }
                }
            }
            */
        });


        self.confidenceRatingFilter = ko.observable(0)

        self.confidenceRatingFilterSubscription = self.confidenceRatingFilter.subscribe(function(value){
            /*
            var numVal = Number(value); 

            for(var x=0; x<self.tweetFeatureMap.length; x++){
                if(Math.abs(self.tweetFeatureMap[x].tweet.rating) >= numVal){
                    self.tweetFeatureMap[x].marker.setMap(self.map());
                }
                else{
                    self.tweetFeatureMap[x].marker.setMap(null); 
                }
            }
            */
        }); 
    

        self.shown = function(){
            self._.checkIfDisposed()
            if(!self._.shown){
                self._.shown = true;

		self._.pipelineManager.registerEventListener("click", self.selectTweet);
                
            }
        }

        self.hidden = function(){
            self.checkIfDisposed();
            if(self._.shown){
                self._.shown = false;

            } 
        }

        self.dispose = function(){
            if(!self._.disposed){
                self.hidden();
                self._.dispoed = true;
            }
        }


        self.selectTweet = function(feature){
		if(feature !== null && feature !== undefined){
			var tweet = feature.get('tweet');
			self.selectedTweet(tweet);
		}
        }

        self.clearSelectedTweet = function(){
            self.selectedTweet(null);
        }
    }

    return {
        get: function(){
            return new SidePanelViewModel();
        },
        type: function(){
            return SidePanelViewModel;
        }
    };
});
