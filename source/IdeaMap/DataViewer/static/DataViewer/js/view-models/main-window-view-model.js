define(["ko", "contentViewModel", "sidePaneViewModel"], function(ko, ContentViewModelModule, SidePaneViewModelModule){
    function MainWindowViewModel(){
        var self = this;  
        
        self._shown = false;
        self._disposed = false;
        self.contentViewModel = ContentViewModelModule.get();
        self.sidePaneViewModel = SidePaneViewModelModule.get();

        self.shown = function(){
            if(!self._shown){
                self.contentViewModel.shown();
                self.sidePaneViewModel.shown();
                self._shown = true;
            }

        };

        self.hidden = function(){
            if(self._shown){
                self.contentViewModel.hidden();
                self.sidePaneViewModel.hidden();
                self._shown = false;
            }
        };

        self.dispose = function(){
            if(!self._disposed){
                self.contentViewModel.dispose();
                self.sidePaneViewModel.dispose();

                self.contentViewModel = null;
                self.sidePaneViewModel = null;
            }
        }
    }

    return {
        get: function(){
            return new MainWindowViewModel();
        },
        type: function(){
            return MainWindowViewModel;
        }
    }
})
