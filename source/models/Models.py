from peewee import *
from yaml import load
from os import path

# Load config file
config = None
with open(path.abspath("../models/config.yml"), "rb") as f:
    config = load(f)

db_config = config["database"]

db = PostgresqlDatabase(db_config["db"], host=db_config["url"], user=db_config["username"], password=db_config["password"])

class BaseModel(Model):
    class Meta:
        database = db

class Frame(BaseModel):
    id = PrimaryKeyField()
    start = DateTimeField()
    end = DateTimeField()
    # tweets agregate
    # processed_tweets agregate

class Tweet(BaseModel):
    id = PrimaryKeyField()

    entities = TextField()
    created_at = DateTimeField()
    coordinates = TextField()
    place = TextField()
    text = TextField()
    original = TextField()
    frame = ForeignKeyField(Frame, related_name="tweets")

class ProcessedTweet(BaseModel):
    id = PrimaryKeyField()

    entities = TextField()
    process_date = DateTimeField()
    created_at = DateTimeField()
    coordinates = TextField()
    place = TextField()
    text = TextField()
    original = TextField()
    rating = FloatField()
    classification = TextField()
    frame = ForeignKeyField(Frame, related_name="processed_tweets")





models = [Frame, Tweet, ProcessedTweet]
