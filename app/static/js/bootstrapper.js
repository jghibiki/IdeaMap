define(["ko", 
	"chain"], 
        function(ko, chain){
    


	/***********
	 * Loading *
	 ***********/

	function LoadServices(context, abort, next){
		require([
			"mapService"
		],
		function(MapServiceModule){
			context.services = {
				mapService: MapServiceModule.get()
			}
			next(context);
		});
	}

	function LoadUIComponents(context, abort, next){
		require([
				"mainWindowViewModel"
		],
		function(
			MainWindowViewModelModule
		){
			context.viewModels = {	
		   		mainWindowViewModel : MainWindowViewModelModule.get()
			}
			next(context);
		})
	}


	/******************
	 * Initialization *
	 ******************/

	function InitializeServices(context, abort, next){
		context.services.mapService.init();
		next(context);
	}


    function InitializeUIComponents(context, abort, next){
        require(["ko-content", "domReady!"], function(){
			next(context);	
        });
    }


	/************
	 * Starting *
	 ************/
	
	function StartServices(context, abort, next){
		context.services.mapService.start();

		next(context);
	}

    function StartUI(context, abort, next){
        ko.applyBindings(context.viewModels.mainWindowViewModel); 
        context.viewModels.mainWindowViewModel.shown();
		next(context)
    }


	/*******************
	 * Begin Lifecycle *
	 *******************/

	chain.get()
		.cc(LoadServices)
		.cc(LoadUIComponents)
		.cc(InitializeServices)
		.cc(InitializeUIComponents)
		.cc(StartServices)
		.cc(StartUI)
		.end({})


})
