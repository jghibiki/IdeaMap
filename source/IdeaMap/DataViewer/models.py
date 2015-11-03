from django.db import models

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
    coordinates = models.TextField()
    place = models.TextField()
    text = models.TextField()
    original = models.TextField()
    rating = models.FloatField()
    classification = models.TextField()
    frame = models.ForeignKey(Frame)

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
