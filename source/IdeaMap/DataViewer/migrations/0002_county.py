# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('DataViewer', '0001_initial'),
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
                ('geom', django.contrib.gis.db.models.fields.PolygonField(srid=-1)),
            ],
        ),
    ]
