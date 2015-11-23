#from django.db import models
from django.contrib.gis.db import models
from django.conf import settings

import json

# This is an auto-generated Django model module created by ogrinspect.
class State(models.Model):
    region = models.CharField(max_length=2)
    division = models.CharField(max_length=2)
    statefp = models.CharField(max_length=2)
    statens = models.CharField(max_length=8)
    geoid = models.CharField(max_length=2)
    stusps = models.CharField(max_length=2)
    name = models.CharField(max_length=100)
    lsad = models.CharField(max_length=2)
    mtfcc = models.CharField(max_length=5)
    funcstat = models.CharField(max_length=1)
    aland = models.FloatField()
    awater = models.FloatField()
    intptlat = models.CharField(max_length=11)
    intptlon = models.CharField(max_length=12)
    geom = models.MultiPolygonField(srid=4326)
    objects = models.GeoManager()


# This is an auto-generated Django model module created by ogrinspect.
class County(models.Model):
    statefp = models.CharField(max_length=2)
    countyfp = models.CharField(max_length=3)
    countyns = models.CharField(max_length=8)
    geoid = models.CharField(max_length=5)
    name = models.CharField(max_length=100)
    namelsad = models.CharField(max_length=100)
    lsad = models.CharField(max_length=2)
    classfp = models.CharField(max_length=2)
    mtfcc = models.CharField(max_length=5)
    csafp = models.CharField(max_length=3)
    cbsafp = models.CharField(max_length=5)
    metdivfp = models.CharField(max_length=5)
    funcstat = models.CharField(max_length=1)
    aland = models.FloatField()
    awater = models.FloatField()
    intptlat = models.CharField(max_length=11)
    intptlon = models.CharField(max_length=12)
    geom = models.MultiPolygonField(srid=4326)
    objects = models.GeoManager()
    state = models.ForeignKey(State, related_name="counties", null=True)


class ProcessedTweet(models.Model):
    entities = models.TextField()
    processed_date = models.DateTimeField()
    created_date = models.DateTimeField()
    text = models.TextField()
    original = models.TextField()
    rating = models.FloatField()
    classification = models.TextField()
    county = models.ForeignKey(County, related_name="tweets", null=True)

    objects = models.GeoManager()
    point = models.PointField(default=[0,0])

    def __str__(self):
        return str(self.id)

    def getJson(self):
        return json.dumps({
            "id": self.id,
            "entities": json.loads(self.entities),
            "created_date": self.created_date.isoformat(),
            "processed_date": self.processed_date.isoformat(),
            "coordinates": json.loads(self.coordinates),
            "place": json.loads(self.place),
            "text": self.text,
            "original": self.original,
            "rating": self.rating,
            "classification": self.classification,
        })


class Filter(models.Model):
    name = models.TextField()
    pattern = models.TextField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)

    def __str__(self):
        return str(self.id)

       
class StateAverage(models.Model):
    """
    Types:
    0 - hourly average
    1 - daily average
    2 - weekly
    4 - monthly
    5 - yearly
    6 - all time average
    """
    state = models.ForeignKey(State, related_name="stateAverages")
    rating = models.FloatField()
    type = models.IntegerField()
    timestamp = models.DateTimeField()

class CountyAverage(models.Model):
    """
    Types:
    0 - hourly average
    1 - daily average
    2 - weekly
    4 - monthly
    5 - yearly
    6 - all time average
    """
    county = models.ForeignKey(County, related_name="countyAverages")
    rating = models.FloatField()
    type = models.IntegerField()
    timestamp = models.DateTimeField()
