import os
from django.contrib.gis.utils import LayerMapping
from .models import County, State, ProcessedTweet
from Core.utils import queryset_iterator
from django.contrib.gis.geos import Point

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

# Auto-generated `LayerMapping` dictionary for State model
state_mapping = {
    'region' : 'REGION',
    'division' : 'DIVISION',
    'statefp' : 'STATEFP',
    'statens' : 'STATENS',
    'geoid' : 'GEOID',
    'stusps' : 'STUSPS',
    'name' : 'NAME',
    'lsad' : 'LSAD',
    'mtfcc' : 'MTFCC',
    'funcstat' : 'FUNCSTAT',
    'aland' : 'ALAND',
    'awater' : 'AWATER',
    'intptlat' : 'INTPTLAT',
    'intptlon' : 'INTPTLON',
    'geom' : 'MULTIPOLYGON',
}


counties_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data', 'county', 'tl_2015_us_county.shp'))
state_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data', 'state', 'tl_2015_us_state.shp'))

def run(verbose=False, county=False, state=False):
    if county:
        lm = LayerMapping(County, counties_shp, county_mapping, transform=False)
        lm.save(strict=True, verbose=verbose)
    if state:
        lm = LayerMapping(State, state_shp, state_mapping, transform=False)
        lm.save(strict=True, verbose=verbose)
    if not county and not state:
        print("Must select which models to import")  


def map(to_state=False):
    if to_state:
        for county in County.objects.all().iterator():
            state = State.objects.get(statefp = county.statefp)
            county.state = state
            county.save()

    if not to_state and not to_tweet:
        print("Must select which mapping routines to run")
