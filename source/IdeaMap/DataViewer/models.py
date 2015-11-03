#from django.db import models
from django.contrib.gis.db import models

import json

# Create your models here.


class Frame(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return str(self.id)


class Tweet(models.Model):
    entities = models.TextField()
    created_at = models.DateTimeField()
    coordinates = models.TextField()
    place = models.TextField()
    text = models.TextField()
    original = models.TextField()
    frame = models.ForeignKey(Frame)

    def __str__(self):
        return str(self.id)


class ProcessedTweet(models.Model):
    entities = models.TextField()
    processed_date = models.DateTimeField()
    created_date = models.DateTimeField()
    text = models.TextField()
    original = models.TextField()
    rating = models.FloatField()
    classification = models.TextField()
    frame = models.ForeignKey(Frame)

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
            "frame": {
                "id": self.frame.id,
                "start_date": self.frame.start_date.isoformat(),
                "end_date": self.frame.end_date.isoformat()
            }
        })


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
