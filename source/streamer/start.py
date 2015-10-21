# mport the necessary methods from tweepy library
import json, sys, os, re, itertools, datetime, pytz, signal, math
sys.path.insert(0, os.path.abspath("../models"))
from Models import *
from tweepy import OAuthHandler
from tweepy import Stream
import tweepy, datetime
from string import punctuation
from multiprocessing import Process, Queue
from time import sleep
from yaml import load

# Load config file
config = None
with open("config.yml", "rb") as f:
    config = load(f)


count = 0
datestamp = datetime.datetime.utcnow() + datetime.timedelta(0, 60)

#Variables that contains the user credentials to access Twitter API
access_token = config["twitter"]["access_token"]
access_token_secret = config["twitter"]["access_token_secret"]
consumer_key = config["twitter"]["consumer_key"]
consumer_secret = config["twitter"]["consumer_secret"]
location = (
    config["location"]["lon1"],
    config["location"]["lat1"],
    config["location"]["lon2"],
    config["location"]["lat2"]
)

def checkFrame(frame):
    if(frame.end < datetime.datetime.utcnow()):
        start = datetime.datetime.utcnow()
        end = start + datetime.timedelta(0,60)
        frame = Frame.create(start=start, end=end)
        return frame
    else:
        return frame

def getFrame():
    frame = Frame.select().order_by(Frame.end.desc()).first()
    return frame




class StreamListener(tweepy.StreamListener):

#This is a basic listener that just prints received tweets to stdout.
    def on_data(self, _data):
        data = json.loads(_data)
        if not "delete" in data:
            if ("coordinates" in data and data["coordinates"] != None) or ("place" in data and data["place"] != None):
                if "hiring" not in data["text"].lower() and "weather" not in data["text"].lower():

                    frame = getFrame()
                    if(datetime.datetime.utcnow() > frame.end):
                        if config["cleaner"]:
                            global q
                            q.put_nowait(frame.id)

                        frame = checkFrame(frame)

                    global datestamp
                    if(datestamp < datetime.datetime.utcnow()):
                        datestamp = datetime.datetime.utcnow() + datetime.timedelta(0,60)

                        global count
                        print "Time Frame: " + str(frame.id) + " Total Tweets: " + str(count)

                    count += 1

                    data = preprocess(data)

                    coord = None
                    place = None


                    if data["coordinates"] != None:
                        coord = data["coordinates"]

                    if data["place"] != None:
                        place = [
                            [
                                data["place"]["bounding_box"]["coordinates"][0][0][0],
                                data["place"]["bounding_box"]["coordinates"][0][0][1]
                            ],
                            [
                                data["place"]["bounding_box"]["coordinates"][0][1][0],
                                data["place"]["bounding_box"]["coordinates"][0][1][1]
                            ],
                            [
                                data["place"]["bounding_box"]["coordinates"][0][2][0],
                                data["place"]["bounding_box"]["coordinates"][0][2][1]
                            ],
                            [
                                data["place"]["bounding_box"]["coordinates"][0][3][0],
                                data["place"]["bounding_box"]["coordinates"][0][3][1]
                            ]
                        ]


                    with db.atomic():
                        row = Tweet.create(
                            entities = json.dumps(data["entities"]),
                            created_at = datetime.datetime.strptime(data["created_at"], '%a %b %d %H:%M:%S +0000 %Y').replace(tzinfo=pytz.UTC),
                            coordinates = json.dumps(coord),
                            place = json.dumps(place),
                            text = data["text"],
                            original = data["original"],
                            frame = frame
                        )

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


    #remove repetitive punctuation
    for p in list(punctuation):
        temp = temp.replace(p, "")

    data["text"] = temp
    return data



def CleanDb(q):
    while True:
        obj = q.get() #deletes entries when passed a frame to remove
        with db.atomic():
            Tweet.delete().where(Tweet.frame == obj).execute()
        sleep(5)

def GracefulExit(_signal, frame):
    if _signal is signal.SIGINT:
        print "\nShutting down..."
        sys.exit(0)

if __name__ == '__main__':
    frameTime = datetime.datetime.utcnow()
    frame = 0

    #set up exit handler
    signal.signal(signal.SIGINT, GracefulExit)

    if config["cleaner"]:
        #spawn db cleaner
        q = Queue()
        p = Process(target=CleanDb, args=(q,))
        p.start()

    frameTime = datetime.datetime.utcnow() + datetime.timedelta(minutes=1)

    #This handles Twitter authetification and the connection to Twitter Streaming API
    listener = StreamListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, listener)

    #This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
    print "Starting Stream..."
    while(True):
        try:
            stream.filter(locations=location, async=False)
            #stream.sample()
        except Exception, e:
            print str(e)