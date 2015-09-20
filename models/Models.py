from peewee import *

db = SqliteDatabase('../twitter.db')

class BaseModel(Model):
    class Meta:
        database = db

class Tweet(BaseModel):
    id = PrimaryKeyField()

    entities = TextField()
    created_at = DateTimeField()
    coordinates = TextField()
    text = TextField()
    original = TextField()

class ProcessedTweet(BaseModel):
    id = PrimaryKeyField()

    entities = TextField()
    process_date = DateTimeField()
    created_at = DateTimeField()
    coordinates = TextField()
    text = TextField()
    original = TextField()
    rating = FloatField()
    classification = TextField()




models = [Tweet, ProcessedTweet]
