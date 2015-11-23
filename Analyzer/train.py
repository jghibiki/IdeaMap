import os
import sys
sys.path.append(os.path.abspath("."))

if __name__ == "__main__":

	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "IdeaMap.settings")
	from django.conf import settings


	try:
	    settings.ANALYZER_CACHE_DIR
	except:
	    raise Exception("ANALYZER_CACHE_DIR must be defined in django settings file.")

	try:
	     settings.ANALYZER_DATA_DIR
	except:
	    raise Exception("ANALYZER_DATA_DIR must be defined in django settings file.")

	if not os.path.exists(settings.ANALYZER_CACHE_DIR):
	    os.makedirs(settings.ANALYZER_CACHE_DIR)


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

	classes = ['pos', 'neg']

	print "Loading training sets..."

	training_file = os.path.join(settings.ANALYZER_DATA_DIR, 'tweet_training.csv')

	with open(training_file,'rb') as training_file:

	    df = pd.read_csv(training_file, header=None)
	    df.columns = ['score', 'text']

	    train_labels = df['score'].values.tolist()
	    train_data = df['text'].values.tolist()

	for curr_class in classes:
	    dirname = os.path.join(settings.ANALYZER_DATA_DIR, "txt_sentoken/", curr_class)
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
	print("Caching ML tools")
	joblib.dump(classifier_liblinear, os.path.join(settings.ANALYZER_CACHE_DIR, "classifier.pickle"))
	joblib.dump(vectorizer, os.path.join(settings.ANALYZER_CACHE_DIR, "vectorizer.pickle"))

	print("Finished training and caching ML.")
