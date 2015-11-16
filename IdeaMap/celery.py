from __future__ import absolute_import

import os
from psycogreen.gevent import patch_psycopg
from celery import Celery

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'IdeaMap.settings')

from django.conf import settings  # noqa

app = Celery('IdeaMap')
patch_psycopg()

# Using a string here means the worker will not have to
# pickle the object when using Windows.
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


