define(["ko", "jquery", "chain", "ol", "mapManager", "pipelineManager"], function(ko, jquery, chain, ol, MapManagerModule, PipelineManagerModule){

    function SidePanelViewModel(){
        var self = this;

        self._ = {        
            shown: false,
            disposed: false,
            loading: false,
            loadTimer: null,
            pointsLayerTitle: "markers",
            mapManager: MapManagerModule.get(),
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
			var tweet = null;
			for(var x=0; x<self.tweets.length; x++){
				if(self.tweets[x].feature === feature){
					self.selectedTweet(self.tweets[x].tweet);
					return;
				}
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
