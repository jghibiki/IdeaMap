import os
from django.contrib.gis.utils import LayerMapping
from .models import County

# Auto-generated `LayerMapping` dictionary for County model
county_mapping = {
    'statefp' : 'STATEFP',
    'countyfp' : 'COUNTYFP',
    'countyns' : 'COUNTYNS',
    'geoid' : 'GEOID',
    'name' : 'NAME',
    'namelsad' : 'NAMELSAD',
    'lsad' : 'LSAD',
    'classfp' : 'CLASSFP',
    'mtfcc' : 'MTFCC',
    'csafp' : 'CSAFP',
    'cbsafp' : 'CBSAFP',
    'metdivfp' : 'METDIVFP',
    'funcstat' : 'FUNCSTAT',
    'aland' : 'ALAND',
    'awater' : 'AWATER',
    'intptlat' : 'INTPTLAT',
    'intptlon' : 'INTPTLON',
    'geom' : 'MULTIPOLYGON',
}

counties_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data', 'tl_2015_us_county.shp'))

def run(verbose=True):
    lm = LayerMapping(County, counties_shp, county_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)

