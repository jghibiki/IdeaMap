requirejs.config({  
    map: {
        "*": {
            "textFilterFactory": "packages/filter/text/text-filter-factory",
            "textFilter": "packages/filter/text/text-filter"
        }
    }    
});
