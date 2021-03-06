# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-01-14 07:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0006_auto_20180114_1401'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parameter',
            name='airborne_monitor',
            field=models.NullBooleanField(verbose_name='机载监控'),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='ground_monitor',
            field=models.NullBooleanField(verbose_name='地面监控'),
        ),
    ]
