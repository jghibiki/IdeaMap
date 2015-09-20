
# coding: utf-8

# In[ ]:

# Dataset1: Polarity dataset v2.0
# http://www.cs.cornell.edu/people/pabo/movie-review-data/
#
# Dataset2: sentiment140 training set
# http://cs.stanford.edu/people/alecmgo/trainingandtestdata.zip

import sys
import os
import datetime
import time
import csv
import pandas as pd
import numpy as np
sys.path.insert(0,os.path.abspath("../models"))
from Models import *

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn import svm
from sklearn.metrics import classification_report

train_data = []
train_labels = []
test_data = []
test_labels = []

def usage():
    print("Usage:")
    print("python %s <data_dir>" % sys.argv[0])
    print("Training set %s <training_dir>" % sys.argv[1])
    print("Test data %s <test_dir>" % sys.argv[2])

if __name__ == '__main__':

    with open('tweet_training.csv', 'rb') as training_file:
        df = pd.read_csv(training_file, header=None)
        df.columns = ['score', 'text']
        print "csv read"
        train_labels = df['score'].values.tolist()
        train_data = df['text'].values.tolist()
        print len(df[df['score']=='pos'])
        print len (df[df['score']=='neg'])
    classes = ['pos', 'neg']
    for curr_class in classes:
        dirname = os.path.join("txt_sentoken/", curr_class)
        for fname in os.listdir(dirname):
            with open(os.path.join(dirname, fname), 'r') as f:
                content = f.read()
                train_data.append(content)
                train_labels.append(curr_class)

    test_dir = sys.argv[1]
    for curr_class in classes:
        dirname = os.path.join(test_dir, curr_class)
        for fname in os.listdir(dirname):
            with open(os.path.join(dirname, fname), 'r') as f:
                content = f.read()
                test_data.append(content)
                test_labels.append(curr_class)

    vectorizer = TfidfVectorizer(min_df=1,
                                 max_df = 1.0,
                                 sublinear_tf=True,
                                 use_idf=True,
                                 decode_error='ignore')
    train_vectors = vectorizer.fit_transform(train_data)
    test_vectors = vectorizer.transform(test_data)

    # Perform classification with SVM, kernel=linear
    classifier_liblinear = svm.LinearSVC()
    t0 = time.time()
    classifier_liblinear.fit(train_vectors, train_labels)
    t1 = time.time()
    prediction_liblinear = classifier_liblinear.predict(test_vectors)
    t2 = time.time()
    time_liblinear_train = t1-t0
    time_liblinear_predict = t2-t1
    print("Results for LinearSVC()")
    print("Training time: %fs; Prediction time: %fs" % (time_liblinear_train, time_liblinear_predict))
    print(classification_report(test_labels, prediction_liblinear))
#
