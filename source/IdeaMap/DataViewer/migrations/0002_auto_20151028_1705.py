# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DataViewer', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='processedtweet',
            old_name='created_at',
            new_name='created_date',
        ),
    ]
