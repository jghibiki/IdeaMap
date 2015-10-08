requirejs.config({  
    map: {
        "*": {
            "confidenceFilterFactory": "packages/filter/confidence/confidence-filter-factory",
            "confidenceFilter": "packages/filter/confidence/confidence-filter"
        }
    }    
});
