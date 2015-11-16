#!/usr/bin/env python
import os
import sys

import gevent
import gevent.monkey
gevent.monkey.patch_all()

#import eventlet
#eventlet.monkey_patch()

import psycogreen.gevent
psycogreen.gevent.patch_psycopg()

#import psycogreen.eventlet
#psycogreen.eventlet.patch_psycopg()

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "IdeaMap.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
