# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Frame',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='ProcessedTweet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('entities', models.TextField()),
                ('processed_date', models.DateTimeField()),
                ('created_at', models.DateTimeField()),
                ('coordinates', models.TextField()),
                ('place', models.TextField()),
                ('text', models.TextField()),
                ('original', models.TextField()),
                ('rating', models.FloatField()),
                ('classification', models.TextField()),
                ('frame', models.ForeignKey(to='DataViewer.Frame')),
            ],
        ),
        migrations.CreateModel(
            name='Tweet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
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
