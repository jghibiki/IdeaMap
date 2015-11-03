# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('DataViewer', '0002_county'),
    ]

    operations = [
        migrations.AlterField(
            model_name='county',
            name='geom',
            field=django.contrib.gis.db.models.fields.MultiPolygonField(srid=-1),
        ),
    ]
