define(["ko", "mapWrapper", "chain"], function(ko, MapWrapperModule, chain){

    function SidePanelViewModel(){
        var self = this;

        self._shown = false;
        self._disposed = false;
        self._loading = false;
        self._timer = null;

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
                            change.value.id, 
                            marker
                        ))
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
                self._shown = true;
            }
        }

        self.hidden = function(){
            if(self._shown){
                self._shown = false;
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
                    .cc(function(context, error, next){
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
                                error();
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

        self._getMoreTweets = function(context, error, next){
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
                    error()
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
