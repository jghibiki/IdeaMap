from flask import Flask, request, jsonify, send_from_directory, url_for
from flask.ext.cors import CORS
from werkzeug.contrib.fixers import ProxyFix
from nocache import nocache
import sys, os, json, datetime
sys.path.insert(0, os.path.abspath("../models"))
from Models import *
from peewee import fn

##################
## Server Setup ##
##################
app = Flask(__name__, static_url_path='')
app.wsgi_app = ProxyFix(app.wsgi_app)
CORS(app, headers=['Content-Type'])




@app.route("/tweets/<int:page>", methods=["GET"])
@nocache
def GetTweets(page):
    frame = getFrame()
    tweets = []
    for tweet in ProcessedTweet.select().where(ProcessedTweet.frame == frame ).dicts().iterator():
        data = {
                "id": tweet["id"],
                "entities": json.loads(tweet["entities"]),
                "created_at": tweet["created_at"],
                "process_date": tweet["process_date"],
                "coordinates": json.loads(tweet["coordinates"]),
				"place": json.loads(tweet["place"]),
                "text": tweet["text"],
                "original": tweet["original"],
                "rating": tweet["rating"],
                "classification": tweet["classification"],
                "frame": tweet["frame"],
                #"frame_start": str(tweet["frame"]["start"]),
                #"frame_end": str(tweet["frame"]["end"])
        }
        tweets.append(data)

    numberOfPages = (ProcessedTweet.select().count() / 100)
    nextLoad = None if numberOfPages <= page+1  else page+1

    return jsonify({"result": tweets, "next": None})

@app.route("/tweets/count", methods=["GET"])
@nocache
def CountTweets():
    tweetCount = ProcessedTweet.select().count()
    return jsonify({"result": tweetCount})

@app.route('/')
def root():
    return send_index()

def send_index():

        response = app.make_response(app.send_static_file('index.html'))

        response.headers.add('Last-Modified', datetime.datetime.now())
        response.headers.add('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
        response.headers.add('Pragma', 'no-cache')
        return response


def getFrame():
    frame = Frame.select().order_by(Frame.end.desc()).limit(2)[1]
    return frame

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)


