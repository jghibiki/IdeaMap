requirejs.config({
    baseUrl: "js",

    deps:["bootstrapper", "jquery"],


    paths: {

        //require plugins
        "viewModel": "require-plugins/viewModel",
        "singleton": "require-plugins/singleton",
        "domReady": "require-plugins/domReady",
        "text": "require-plugins/text",
        "path": "require-plugins/path",
        "async": "require-plugins/async",
        "modular": "require-plugins/modular",

        //ko plugins
        "ko-content": "ko-plugins/ko-content",

        //third party scripts
        "ko": "third-party/knockout-3.3.0",
        "ol": "third-party/ol",

        //utils
        "chain": "utils/chain",

    },
    
    map: {
        '*': {
            //view models
            "mainWindowViewModel": "singleton!view-models/main-window-view-model",
            "contentViewModel": "singleton!viewModel!views/content.html:view-models/content-view-model",
            "sidePaneViewModel": "singleton!viewModel!views/side-pane.html:view-models/side-pane-view-model",
            "popupViewModel": "singleton!viewModel!views/popup.html:view-models/popup-view-model",
            "filterWorkflowViewModel": "singleton!viewModel!views/filter-workflow.html:view-models/filter-workflow-view-model",

            //services
            "mapService": "singleton!services/map-service",
            "moduleService": "singleton!services/module-service",
            "pipelineService": "singleton!services/pipeline-service",
            "controlService": "singleton!services/control-service",
            "filterService": "singleton!services/filter-service",
            "filterWorkflowService": "singleton!services/filter-workflow-service",

            //managers
            "singletonManager": "managers/singleton-manager",
            "mapManager": "singleton!managers/map-manager",
            "moduleManager": "singleton!managers/module-manager",
            "pipelineManager": "singleton!managers/pipeline-manager",
            "controlManager": "singleton!managers/control-manager",
            "filterManager": "singleton!managers/filter-manager",
            "filterWorkflowManager": "singleton!managers/filter-workflow-manager"

        }
    },
    
    config: {
        "services/module-service": {
            "modules": [
                //controls
                {
                    name: "packages/control/slider",
                    type: "control"
                },
                {
                    name: "packages/control/text",
                    type: "control"
                },

                //filters 
                {
                    name: "packages/filter/confidence",
                    type: "filter"
                },
                {
                    name: "packages/filter/text",
                    type: "filter"
                },
                {
                    name: "packages/filter/regex",
                    type: "filter"
                },
                
                //renderers
                {
                    name: "packages/renderer/simple-dots",
                    type: "renderer"
                },
                {
                    name: "packages/renderer/red-green-dots",
                    type: "renderer"
                }

            ]
        },
        "services/pipeline-service": {
            "defaultRenderer": "packages/renderer/red-green-dots"
        }
    }
})
