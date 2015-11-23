# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0002_state'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Tweet',
        ),
        migrations.AddField(
            model_name='county',
            name='state',
            field=models.ForeignKey(related_name='counties', to='Core.State', null=True),
        ),
        migrations.AddField(
            model_name='processedtweet',
            name='county',
            field=models.ForeignKey(related_name='tweets', to='Core.County', null=True),
        ),
    ]
