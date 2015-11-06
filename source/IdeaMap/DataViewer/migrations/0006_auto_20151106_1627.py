# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DataViewer', '0005_filter'),
    ]

    operations = [
        migrations.RenameField(
            model_name='filter',
            old_name='user',
            new_name='owner',
        ),
    ]
