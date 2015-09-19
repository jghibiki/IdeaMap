define(["ko"], function(ko){

    function ContentViewModel(){
        var self = this;

        self._shown = false;
        self._disposed = false;
        self._map = null;

        self.shown = function(){
            if(!self._shown){

                self._map = new google.maps.Map(document.getElementById('map'));

                var bounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(25.82, -124.39),
                    new google.maps.LatLng(49.38, -66.94)
                )
                self._map.fitBounds(bounds);

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
    }

    return {
        get: function(){
            return new ContentViewModel();
        },
        type: function(){
            return ContentViewModel;
        }
    };
});
