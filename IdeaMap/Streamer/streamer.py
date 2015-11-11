from __future__ import absolute_import
import json, sys, os, re, itertools, datetime, pytz, signal, math
from tweepy import OAuthHandler
from tweepy import Stream
import tweepy, datetime
from string import punctuation
from time import sleep
from django.contrib.gis.geos import Point, Polygon

import os
import sys
sys.path.append(os.path.abspath("."))

# Load Django config
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'IdeaMap.settings')
import django
django.setup()
from django.conf import settings  # noqa
from Analyzer.tasks import classify

count = 0
datestamp = datetime.datetime.utcnow() + datetime.timedelta(0, 1)

# Variables that contains the user credentials to access Twitter API
access_token = settings.STREAMER_ACCESS_TOKEN
access_token_secret = settings.STREAMER_ACCESS_TOKEN_SECRET
consumer_key = settings.STREAMER_CONSUMER_KEY
consumer_secret = settings.STREAMER_CONSUMER_SECRET
location = settings.STREAMER_LOCATION



class StreamListener(tweepy.StreamListener):
    """
    This is a basic listener that just prints received tweets to stdout.
    """
    def on_data(self, _data):
        data = json.loads(_data)
        if "delete" not in data:
            if ("coordinates" in data and data["coordinates"] is not None) or ("place" in data and data["place"] is not None):
                if "hiring" not in data["text"].lower() and "weather" not in data["text"].lower():


                    global datestamp
                    if(datestamp < datetime.datetime.utcnow()):
                        datestamp = datetime.datetime.utcnow() + datetime.timedelta(0,60)

                        global count
                        print " Total Tweets: " + str(count)

                    count += 1

                    data = preprocess(data)

                    coord = None

                    if data["coordinates"] is not None:
                        coord = Point(
                            data["coordinates"]["coordinates"][0],
                            data["coordinates"]["coordinates"][1])

                    if data["place"] is not None:
                        place = Polygon((
                            (
                                data["place"]["bounding_box"]["coordinates"][0][0][0],
                                data["place"]["bounding_box"]["coordinates"][0][0][1]
                            ),
                            (
                                data["place"]["bounding_box"]["coordinates"][0][1][0],
                                data["place"]["bounding_box"]["coordinates"][0][1][1]
                            ),
                            (
                                data["place"]["bounding_box"]["coordinates"][0][2][0],
                                data["place"]["bounding_box"]["coordinates"][0][2][1]
                            ),
                            (
                                data["place"]["bounding_box"]["coordinates"][0][3][0],
                                data["place"]["bounding_box"]["coordinates"][0][3][1]
                            ),
                            (
                                data["place"]["bounding_box"]["coordinates"][0][0][0],
                                data["place"]["bounding_box"]["coordinates"][0][0][1]
                            )
                        ))

                        coord = place.centroid

                    classify.delay({
                        "entities":  data["entities"],
                        "created_date": data["created_at"],
                        "text": data["text"],
                        "original": data["original"],
                        "point": [coord.x, coord.y]
                    })

        return True

    def on_error(self, status):
        print status


def preprocess(data):
    data["original"] = data["text"]
    temp = data["text"]
    temp.lower()

    temp.replace("rt", "retweet")
    temp.replace("b/c", "because")
    temp.replace("@reply", "")
    temp.replace(" b ", " be ")
    temp.replace("b4", "before")
    temp.replace(" ab ", " about ")
    temp.replace(" abt ", " about ")
    temp.replace(" bfn ", " bye for now ")
    temp.replace(" br ", " best reguards ")
    temp.replace(" chk ", " check ")
    temp.replace(" cld ", " could ")
    temp.replace(" cre8 ", " create ")
    temp.replace(" da ", " the ")
    temp.replace(" dt ", " direct tweet ")
    temp.replace(" em ", " email ")
    temp.replace(" fab ", " fabulous ")
    temp.replace(" fav ", " favorite ")
    temp.replace(" ic ", " i see ")
    temp.replace(" icymi ", " in case you missed it")
    temp.replace(" idk ", " i don't know ")
    temp.replace(" kk ", " that is nice ")
    temp.replace(" selfie ", " a picture of myself ")
    temp.replace(" tbt ", " throw back Thursday ")
    temp.replace(" tweet ", " a twitter status update ")
    temp.replace(" tweeting ", " writing a twitter status update ")
    temp.replace(" u ", " you ")
    temp.replace(" r ", " are ")
    temp.replace(" luv ", " love ")

    # remove repetitive punctuation
    for p in list(punctuation):
        temp = temp.replace(p, "")

    data["text"] = temp
    return data


def GracefulExit(_signal, frame):
    if _signal is signal.SIGINT:
        print "\nShutting down..."
        sys.exit(0)

if __name__ == '__main__':
    # set up exit handler
    signal.signal(signal.SIGINT, GracefulExit)

    # This handles Twitter authetification and the connection to Twitter Streaming API
    listener = StreamListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, listener)

    # This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
    print "Starting Stream..."
    while(True):
        stream.filter(locations=location, async=False)
