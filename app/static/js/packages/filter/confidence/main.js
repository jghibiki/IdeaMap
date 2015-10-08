requirejs.config({  
    map: {
        "*": {
            "confidenceFilterFactory": "packages/filter/confidence/confidence-filter-factory",
            "confidenceFiler": "packages/filter/confidence/confidence-filter"
        }
    }    
});
