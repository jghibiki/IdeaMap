requirejs.config({
	map: {
		"*": {
			"textFactory": "singleton!packages/control/text/text-factory",
			"textViewModel": "viewModel!packages/control/text/text.html:packages/control/text/text-view-model"

		}
	}
	
});


