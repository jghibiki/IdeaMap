define(["ko", 
    "chain"], 
        function(ko, chain){
    


    /***********
     * Loading *
     ***********/

    function LoadServices(context, abort, next){
        require([
            "mapService",
            "moduleService",
            "pipelineService",
            "controlService",
            "filterService",
            "filterWorkflowService"
        ],
        function(MapServiceModule,
                 ModuleServiceModule,
                 PipelineServiceModule,
                 ControlServiceModule,
                 FilterServiceModule,
                 FilterWorkflowServiceModule){
            context.services = {
                mapService: MapServiceModule.get(),
                moduleService: ModuleServiceModule.get(),
                pipelineService: PipelineServiceModule.get(),
                controlService: ControlServiceModule.get(),
                filterService: FilterServiceModule.get(),
                filterWorkflowService: FilterWorkflowServiceModule.get()
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
        context.services.moduleService.init();
        context.services.pipelineService.init();
        context.services.controlService.init();
        context.services.filterService.init();
        context.services.filterWorkflowService.init();
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
        context.services.moduleService.start();
        context.services.pipelineService.start();
        context.services.controlService.start();
        context.services.filterService.start();
        context.services.filterService.start();
        context.services.filterWorkflowService.start();
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
