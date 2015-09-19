define(["ko"], function(ko){
    function AppState(){
        var self = this;

        self.map = ko.observable();
    }

    return {
        get: function(){
            return new AppState();
        },
        type: function(){
            return AppState;
        }
    };
});

