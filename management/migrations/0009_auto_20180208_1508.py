# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-02-08 07:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0008_auto_20180114_1557'),
    ]

    operations = [
        migrations.CreateModel(
            name='AircraftInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('aircraft_model', models.CharField(max_length=5, verbose_name='飞机型号')),
                ('aircraft_number', models.CharField(max_length=5, verbose_name='架机号')),
            ],
        ),
        migrations.DeleteModel(
            name='Goods',
        ),
        migrations.RemoveField(
            model_name='img',
            name='book',
        ),
        migrations.DeleteModel(
            name='Book',
        ),
        migrations.DeleteModel(
            name='Img',
        ),
    ]
