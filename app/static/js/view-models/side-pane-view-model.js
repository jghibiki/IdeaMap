define(["ko"], function(ko){

    function SidePanelViewModel(){
        var self = this;

        self._shown = false;
        self._disposed = false;
        self._map = null;

        self.shown = function(){
            if(!self._shown){

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
            return new SidePanelViewModel();
        },
        type: function(){
            return SidePanelViewModel;
        }
    };
});
