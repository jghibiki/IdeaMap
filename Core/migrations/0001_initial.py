# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='County',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('statefp', models.CharField(max_length=2)),
                ('countyfp', models.CharField(max_length=3)),
                ('countyns', models.CharField(max_length=8)),
                ('geoid', models.CharField(max_length=5)),
                ('name', models.CharField(max_length=100)),
                ('namelsad', models.CharField(max_length=100)),
                ('lsad', models.CharField(max_length=2)),
                ('classfp', models.CharField(max_length=2)),
                ('mtfcc', models.CharField(max_length=5)),
                ('csafp', models.CharField(max_length=3)),
                ('cbsafp', models.CharField(max_length=5)),
                ('metdivfp', models.CharField(max_length=5)),
                ('funcstat', models.CharField(max_length=1)),
                ('aland', models.FloatField()),
                ('awater', models.FloatField()),
                ('intptlat', models.CharField(max_length=11)),
                ('intptlon', models.CharField(max_length=12)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Filter',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.TextField()),
                ('pattern', models.TextField()),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ProcessedTweet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('entities', models.TextField()),
                ('processed_date', models.DateTimeField()),
                ('created_date', models.DateTimeField()),
                ('text', models.TextField()),
                ('original', models.TextField()),
                ('rating', models.FloatField()),
                ('classification', models.TextField()),
                ('point', django.contrib.gis.db.models.fields.PointField(default=[0, 0], srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Tweet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('entities', models.TextField()),
                ('created_date', models.DateTimeField()),
                ('coordinates', models.TextField()),
                ('place', models.TextField()),
                ('text', models.TextField()),
                ('original', models.TextField()),
                ('point', django.contrib.gis.db.models.fields.PointField(default=[0, 0], srid=4326)),
            ],
        ),
    ]
