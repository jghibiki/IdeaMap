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

	        //services
            "mapService": "singleton!services/map-service",
			"moduleService": "singleton!services/module-service",
			"pipelineService": "singleton!services/pipeline-service",

            //managers
            "singletonManager": "managers/singleton-manager",
            "mapManager": "singleton!managers/map-manager",
			"moduleManager": "singleton!managers/module-manager",
			"pipelineManager": "singleton!managers/pipeline-manager",


            //wrappers
            "mapWrapper": "singleton!wrappers/map-wrapper"
        }
    },
	
	config: {
		"services/module-service": {
			"modules": [
				//controls
				{
					name: "packages/control/confidence-rating",
					type: "control"
				},

				//filters 
				{
					name: "packages/filter/filter-by-polarity",
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
