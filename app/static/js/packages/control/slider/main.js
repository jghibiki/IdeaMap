requirejs.config({
	map: {
		"*": {
			"sliderFactory": "singleton!packages/contol/slider/slider-factory",
			"sliderViewModel": "viewModel!packages/control/slider/slider.html:packages/control/slider/slider-view-model"

		}
	}
	
});


