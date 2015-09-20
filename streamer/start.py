# mport the necessary methods from tweepy library
import json, sys, os, re, itertools, datetime, pytz
sys.path.insert(0, os.path.abspath("../models"))
from Models import *
from tweepy import OAuthHandler
from tweepy import Stream
import tweepy, datetime
from string import punctuation
from multiprocessing import Process, Queue
from time import sleep



#Variables that contains the user credentials to access Twitter API
access_token = "43207500-vVaHcVk1OhdGrmp4bYnnlpGqY04gJ1l3VHKiAVxfC"
access_token_secret = "4HCkIZa7rZDSbU7BOZS75JAdXe0kaS3VK8lv9rfF81pY2"
consumer_key = "9YB1LjysXrJUXhfPfdnfyB1lP"
consumer_secret = "xEWYrXMcyQFrKndrl10s8193HjjuBtvGE9yybrk5TQjvrYnsQy"


class StreamListener(tweepy.StreamListener):

#This is a basic listener that just prints received tweets to stdout.
    def on_data(self, _data):
        data = json.loads(_data)
        if not "delete" in data:
            if "lang" in data:
                if data["lang"] == "en":
                    with db.atomic():
                        data = preprocess(data)

                        row = Tweet.create(
                            entities = json.dumps(data["entities"]),
                            created_at = datetime.datetime.strptime(data["created_at"], '%a %b %d %H:%M:%S +0000 %Y').replace(tzinfo=pytz.UTC),
                            coordinates = json.dumps(data["coordinates"]),
                            text = data["text"],
                            original = data["original"]
                        )
                        print row.id
                    return True

    def on_error(self, status):
        print status



def preprocess(data):
    data["original"] = data["text"]
    temp = data["text"]
    temp.lower()

    #remove repetitive punctuation
    for p in list(punctuation):
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


        temp = temp.replace(p, "")

    data["text"] = temp
    return data



def CleanDb(q):
    while True:
        delta = datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
        with db.atomic():
            Tweet.delete().where(Tweet.created_at < delta).execute()
        sleep(5)

if __name__ == '__main__':

    #spawn db cleaner
    q = Queue()
    p = Process(target=CleanDb, args=(q,))
    p.start()

    #This handles Twitter authetification and the connection to Twitter Streaming API
    listener = StreamListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, listener)

    #This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
    stream.filter(locations=(-137.8,21.4,-66.5,51.6), async=False)
    #stream.sample()
