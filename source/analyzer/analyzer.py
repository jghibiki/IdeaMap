
# coding: utf-8

# In[ ]:

# Dataset1: Polarity dataset v2.0
# http://www.cs.cornell.edu/people/pabo/movie-review-data/
#
# Dataset2: Sentiment140 training set
# http://cs.stanford.edu/people/alecmgo/trainingandtestdata.zip

import sys
import os
import datetime
import time, signal
sys.path.insert(0,os.path.abspath("../models"))
from Models import *

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn import svm
from sklearn.metrics import classification_report
from sklearn.externals import joblib

train_data = []
train_labels = []
test_data = []
test_labels = []
classifier_liblinear = svm.LinearSVC()
datestamp = datetime.datetime.utcnow() + datetime.timedelta(0, 60)
currentFrame = None
previousFrame = None

def prune_old_tweets(newFrame):
    global currentFrame
    global previousFrame
    if(currentFrame == None):
        currentFrame = getFrame()
    if(previousFrame == None):
        previousFrame = getFrameToPrune()

    if(newFrame != currentFrame):
        if previousFrame is not None:
            print "Pruning Frame: " + str(previousFrame.id)
            with db.atomic():
                ProcessedTweet.delete().where(ProcessedTweet.frame == previousFrame).execute()
        previousFrame = currentFrame
        currentFrame = newFrame

def printUpdate(counter):
    global datestamp
    if(datestamp < datetime.datetime.utcnow()):
        print "Tweets Processed: " + str(counter)
        datestamp = datetime.datetime.utcnow() + datetime.timedelta(0, 60)

def getFrame():
    frame = Frame.select().order_by(Frame.end.desc()).first()
    return frame

def getFrameToPrune():
    count = Frame.select().order_by(-Frame.end).limit(3).count()
    if count >= 3:
        frame = Frame.select().order_by(Frame.end.desc()).limit(3)[2]
        return frame
    return None


def classify(data):
    try:
        test_vectors = vectorizer.transform([data])
        prediction_liblinear = classifier_liblinear.predict(test_vectors)
        confidence = classifier_liblinear.decision_function(test_vectors)
        return [prediction_liblinear[0], confidence]
    except:
        print data.original
        return None


def usage():
    print("Usage:")
    print("python %s <data_dir>" % sys.argv[0])

def GracefulExit(_signal, frame):
    if _signal is signal.SIGINT:
        print "\nShutting down..."
        sys.exit(0)



if __name__ == '__main__':
    signal.signal(signal.SIGINT, GracefulExit)
    classes = ['pos', 'neg']

    vectorizer = None
    if os.path.isfile("clf.pkl") and os.path.isfile("vct.pkl"):
        print "Loading cached vectorizer and classifier"
        vectorizer = joblib.load("vct.pkl")
        classifier_liblinear = joblib.load("clf.pkl")

    else:
        # Read the data
        print "loading training sets..."
        with open('tweet_training.csv', 'rb') as training_file:
            df = pd.read_csv(training_file, header=None)
            df.columns = ['score', 'text']
            train_labels = df['score'].values.tolist()
            train_data = df['text'].values.tolist()
        classes = ['pos', 'neg']
        for curr_class in classes:
            dirname = os.path.join("txt_sentoken/", curr_class)
            for fname in os.listdir(dirname):
                with open(os.path.join(dirname, fname), 'r') as f:
                    content = f.read()
                    train_data.append(content)
                    train_labels.append(curr_class)

        vectorizer = TfidfVectorizer(min_df=5,
                                     max_df = 0.8,
                                     sublinear_tf=True,
                                     use_idf=True,
                                     decode_error="ignore")

        print "vectorizing training set..."
        train_vectors = vectorizer.fit_transform(train_data)
        print "training svm..."
        # Train the classifier
        classifier_liblinear.fit(train_vectors, train_labels)

        # cahce vectorizer and classifier
        joblib.dump(classifier_liblinear, "clf.pkl")
        joblib.dump(vectorizer, "vct.pkl")



    # Process tweets until someone kills this
    print "starting db loop..."
    counter = 0
    while True:
        frame = None
        if Tweet.select().count()>0:
            for trow in Tweet.select().order_by(Tweet.created_at.desc()):
                counter += 1
                classified_tweet = classify(trow.text)
                frame = getFrame()
                if classified_tweet is not None:
                    with db.atomic():
                        ProcessedTweet.create(
                                entities=trow.entities,
                                process_date=datetime.datetime.utcnow(),
                                created_at=trow.created_at,
                                coordinates=trow.coordinates,
                                place=trow.place,
                                text=trow.text,
                                original=trow.original,
                                rating=classified_tweet[1],
                                classification=classified_tweet[0],
                                frame=trow.frame.id)

                with db.atomic():
                    trow.delete_instance()
                printUpdate(counter)
                prune_old_tweets(frame)
        time.sleep(1)
        printUpdate(counter)
        prune_old_tweets(frame)

