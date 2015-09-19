define(["ko", "mapWrapper"], function(ko, MapWrapperModule){

    function SidePanelViewModel(){
        var self = this;

        self._shown = false;
        self._disposed = false;

        self.map = MapWrapperModule.get().map;
        self.tweets = ko.observableArray([])
        self.tweetFeatureMap = []

        self.tweetSubscription = self.tweets.subscribe(function(changedTweets){
            changedTweets.forEach(function(change){
                if(change.status === "added"){
                    tweetFeatureMap.push((
                        change.value.id, 
                        self.map().data.addGeoJson({
                            "type": "Feature",
                            "geometry": change.value.coordinate
                        })
                    ))
                }
                else if(change.status === "deleted"){
                    for(var tuple in tweetFeatureMap){
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
            window.fetch("/tweets")
                .then(function(response){
                    for(tweet in response.json()["result"]){
                        self.tweets.push(tweet);
                    }
                })
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
