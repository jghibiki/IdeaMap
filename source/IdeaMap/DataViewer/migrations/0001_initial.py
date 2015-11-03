# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Frame',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
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
                ('frame', models.ForeignKey(to='DataViewer.Frame')),
            ],
        ),
        migrations.CreateModel(
            name='Tweet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('entities', models.TextField()),
                ('created_at', models.DateTimeField()),
                ('coordinates', models.TextField()),
                ('place', models.TextField()),
                ('text', models.TextField()),
                ('original', models.TextField()),
                ('frame', models.ForeignKey(to='DataViewer.Frame')),
            ],
        ),
    ]
