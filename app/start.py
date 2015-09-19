from flask import Flask, request, jsonify, send_from_directory, url_for
from flask.ext.cors import CORS
from werkzeug.contrib.fixers import ProxyFix
from nocache import nocache
import sys, os, json, datetime
sys.path.insert(0, os.path.abspath("../models"))
from Models import *

##################
## Server Setup ##
##################
app = Flask(__name__, static_url_path='')
app.wsgi_app = ProxyFix(app.wsgi_app)
CORS(app, headers=['Content-Type'])


@app.route("/tweets", methods=["GET"])
@nocache
def GetTweets():
    tweets = []
    for tweet in ProcessedTweet.select().order_by(ProcessedTweet.created_at):
        data = {
                "id": tweet.id,
                "entities": json.loads(tweet.entities),
                "created_at": tweet.created_at,
                "coordinates": tweet.coordinates,
                "text": tweet.text,
                "rating": tweet.rating
        }

        with db.atomic():
            tweet.delete_instance()

    return jsonify({"result": tweets})

@app.route('/')
def root():
    return send_index()

def send_index():

        response = app.make_response(app.send_static_file('index.html'))

        response.headers.add('Last-Modified', datetime.datetime.now())
        response.headers.add('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
        response.headers.add('Pragma', 'no-cache')
        return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
