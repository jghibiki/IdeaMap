requirejs.config({  
    map: {
        "*": {
            "regexFilterFactory": "packages/filter/regex/regex-filter-factory",
            "regexFilter": "packages/filter/regex/regex-filter"
        }
    }    
});
