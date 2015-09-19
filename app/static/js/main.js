requirejs.config({
    baseUrl: "js",

    deps:["bootstrapper"],

    paths: {

        //require plugins
        "viewModel": "require-plugins/viewModel",
        "singleton": "require-plugins/singleton",
        "domReady": "require-plugins/domReady",
        "text": "require-plugins/text",
        "path": "require-plugins/path",
        "async": "require-plugins/async",

        //ko plugins
        "ko-content": "ko-plugins/ko-content",

        //third party scripts
        "ko": "third-party/knockout-3.3.0"
    },
    
    map: {
        '*': {
            //view models
            "mainWindowViewModel": "singleton!view-models/main-window-view-model",
            "contentViewModel": "singleton!viewModel!views/content.html:view-models/content-view-model",
            "sidePaneViewModel": "singleton!viewModel!views/side-pane.html:view-models/side-pane-view-model",

            //managers
            "singletonManager" : "managers/singleton-manager",

            //wrappers
            "mapWrapper" : "singleton!wrappers/map-wrapper"
        }
    }
})
