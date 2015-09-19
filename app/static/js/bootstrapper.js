define(["ko", 
        "mainWindowViewModel"], 
        function(ko, MainWindowViewModelModule){
    
    var MainWindowViewModel = MainWindowViewModelModule.get();


    function InitializeUIComponents(){
        require(["ko-content", "domReady!"], function(){
            StartUI();
        });
    }

    function StartUI(){
        ko.applyBindings(MainWindowViewModel); 
        MainWindowViewModel.shown();
    }


    var timer = setInterval(function(){
        if(google !== undefined){
            clearInterval(timer);
            InitializeUIComponents();
        }
    }, 100);


})
