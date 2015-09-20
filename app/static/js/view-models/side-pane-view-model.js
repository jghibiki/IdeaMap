define(["ko", "mapWrapper", "chain"], function(ko, MapWrapperModule, chain){

    function SidePanelViewModel(){
        var self = this;

        self._shown = false;
        self._disposed = false;
        self._loading = false;
        self._deleting = false;
        self._loadTimer = null;
        self._deleteTimer = null;

        self._pos = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|5AB300")
        self._neg = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|B30000")

        self.map = MapWrapperModule.get().map;
        self.tweets = ko.observableArray([])
        self.tweetFeatureMap = []

        self.tweetSubscription = self.tweets.subscribe(function(changedTweets){
            changedTweets.forEach(function(change){
                if(change.status === "added"){
                    if(!(change.value in self.tweets())){

                        var icon = null;
                        if(change.classification === "pos"){
                            icon = self._pos; 
                        }
                        else if (change.classification == "neg"){
                            icon = self._neg;
                        }
                        else{
                            icon = self._pos;
                        }
                        
                        var marker = new google.maps.Marker({
                            position: {lat: change.value.coordinates.coordinates[1],
                                       lng: change.value.coordinates.coordinates[0]},
                            map: self.map(),
                            icon: icon
                        })

                        self.tweetFeatureMap.push((
                            change.value, 
                            marker
                        ))
                        //change tweetFeatureMap to be observable so that we can modify the polyline set when this is modified
                    }
                }
                else if(change.status === "deleted"){
                    for(var tuple in self.tweetFeatureMap){
                        if(tuple[0] === change.value.text){
                            self.map().data.remove(tuple[1]);
                            break;
                        }
                    }
                }
            });
        }, null, "arrayChange");


        self.shown = function(){
            if(!self._shown){
                
                self.getTweets();
                
                self._loadTimer = setInterval(self.getTweets, 300000);
                self._deleteTimer = setInterval(self.deleteTweets, 60000);
                self._shown = true;
            }
        }

        self.hidden = function(){
            if(self._shown){
                self._shown = false;

                clearTimer(self._loadTimer);
                clearTimer(self._deleteTimer);
            } 
        }

        self.dispose = function(){
            if(!self._disposed){
                self.hidden();
                self._map = null;
                self._dispoed = true;
            }
        }

        self.getTweets = function(){
            if(!self._loading){
                self._loading = true;
                chain.get()
                    .cc(function(context, abort, next){
                        $.ajax({
                            url: "/tweets/0",
                            type: "GET",
                            dataType: "json",
                            success: function(response){
                                context.response = response;
                                next(context);
                            },
                            error: function(error){
                                self._loading = false;
                                abort();
                            }
                        });
                })
                .cc(function(context, error, next){
                    var json = context.response
                    for(tweet in json["result"]){
                        self.tweets.push(json["result"][tweet]);
                    }
                    if(json["next"] !== null && json["next"] !== undefined){
                        context.page = json["next"];
                        context.chain.cc(self._getMoreTweets)
                            .cc(self._processMoreTweets)
                    }
                    next(context);
                })
                .end({}, function(){
                    self._loading = false;   
                });
            }
        }

        self._getMoreTweets = function(context, abort, next){
            $.ajax({
                url: "/tweets/"+context.page,
                type: "GET",
                dataType: "json",
                success: function(response){
                    context.response = response;
                    next(context);
                },
                error: function(error){
                    self._loading = false;
                    abort()
                }
            });
        }

        self._processMoreTweets = function(context, error, next){
            var json = context.response
            for(tweet in json["result"]){
                self.tweets.push(json["result"][tweet]);
            }
            if(json["next"] !== null && json["next"] !== undefined){
                context.page = json["next"];
                context.chain.cc(self._getMoreTweets)
                    .cc(self._processMoreTweets)
            }
            next(context); 
        }
        
        self.deleteTweets = function(){
            if (!self._deleting){
                self._deleting = true;
                for(var i =0; i < self.tweets().length; i++){
                    newDate = new Date().getTime();
                    oldDate = new Date(newDate-15*60000);
                    console.log(self.tweets()[i].processed_date);
                    console.log(oldDate);
                    if(self.tweets()[i].processed_date < oldDate){
                        self.tweets().remove(self.tweets()[i]);
                    }
                }
            }
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
