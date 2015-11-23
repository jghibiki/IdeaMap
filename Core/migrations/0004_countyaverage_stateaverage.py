# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0003_auto_20151116_2218'),
    ]

    operations = [
        migrations.CreateModel(
            name='CountyAverage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rating', models.IntegerField()),
                ('type', models.IntegerField()),
                ('timestamp', models.DateTimeField()),
                ('county', models.ForeignKey(to='Core.County')),
            ],
        ),
        migrations.CreateModel(
            name='StateAverage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rating', models.IntegerField()),
                ('type', models.IntegerField()),
                ('timestamp', models.DateTimeField()),
                ('state', models.ForeignKey(to='Core.State')),
            ],
        ),
    ]
