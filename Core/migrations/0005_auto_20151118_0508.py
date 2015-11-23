# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0004_countyaverage_stateaverage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='countyaverage',
            name='rating',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='stateaverage',
            name='rating',
            field=models.FloatField(),
        ),
    ]
