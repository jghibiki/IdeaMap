import sys, os
sys.path.insert(0, os.path.abspath("../models"))
from Models import *
from peewee import *

db.drop_tables(models, safe=True)
db.create_tables(models, safe=True)
