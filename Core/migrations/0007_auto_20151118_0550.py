# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0006_auto_20151118_0528'),
    ]

    operations = [
        migrations.AlterField(
            model_name='countyaverage',
            name='county',
            field=models.ForeignKey(related_name='countyAverages', to='Core.County'),
        ),
        migrations.AlterField(
            model_name='stateaverage',
            name='state',
            field=models.ForeignKey(related_name='stateAverages', to='Core.State'),
        ),
    ]
