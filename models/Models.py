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

class ProcessedTweet(BaseModel):
    id = PrimaryKeyField()

    entities = TextField()
    process_date = DateTimeField()
    created_at = DateTimeField()
    coordinates = TextField()
    text = TextField()
    rating = IntegerField()




models = [Tweet, ProcessedTweet]
