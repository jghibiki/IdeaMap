define(["ko", "jquery", "chain", "ol", "mapManager"], function(ko, jquery, chain, ol, MapManagerModule){

    function SidePanelViewModel(){
        var self = this;

        self._ = {        
            shown: false,
            disposed: false,
            loading: false,
            loadTimer: null,
            pointsLayerTitle: "markers",
            mapManager: MapManagerModule.get(),
            
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

        self.tweets = [];
        self.filters = []; 
		self.key = null;

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
                
                self.getTweets();
                
                self._.loadTimer = setInterval(self.getTweets, 60000);
            }
        }

        self.hidden = function(){
            self.checkIfDisposed();
            if(self._.shown){
                self._.shown = false;

                clearTimer(self._.loadTimer);
            } 
        }

        self.dispose = function(){
            if(!self._.disposed){
                self.hidden();
                self._.dispoed = true;
            }
        }

        self.getTweets = function(){
            self._.checkIfDisposed();
            self._.checkIfShown();
            if(!self._.loading){
                self._.loading = true;
                chain.get()
                .cc(function(context, abort, next){
                    console.log("Deleting expired tweets.");
					self._.mapManager.Unsubscribe(self.key);
                    self._.mapManager.RemoveLayer(self._.pointsLayerTitle);
                    self.tweets = [];
                    next();
                })
                .cc(function(context, abort, next){
                    console.log("Loading new tweets.");
                    $.ajax({
                        url: "/tweets/0",
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
                    for(var x=0; x< json["result"].length; x++){
                        var tweet = json["result"][x];
                        tweet.process_date = new Date(Date(tweet.process_date));

						
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

						var geom = new ol.geom.Point(coords)
						var feature = new ol.Feature(geom);

						self.tweets.push({
							tweet: tweet,
							feature: feature
						});

						features.push(feature);
                    }

					self.key = self._.mapManager.Subscribe(ol.MapBrowserEvent.EventType.SINGLECLICK, self.selectTweet);

                    var sourceVector = new ol.source.Vector({
                        features: features
                    });

                    var layerVector = new ol.layer.Vector({
                        title: self._.pointsLayerTitle,
                        source: sourceVector
                    });

					self._.mapManager.AddLayer(layerVector);

                    next();
                })
                .end({}, function(){
                    self._.loading = false;   
                });
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
