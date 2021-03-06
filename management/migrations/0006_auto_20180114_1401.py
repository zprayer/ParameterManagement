# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-01-14 06:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0005_auto_20180114_1359'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parameter',
            name='acquisitionInfo',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='management.AcquisitionInfo'),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='position',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='management.PositionInfo'),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='schematicInfo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='management.SchematicInfo'),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='sensor',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='management.SensorInfo'),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='sensornumber',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='management.SensorNumberInfo'),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='separation',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='management.SeparationInfo'),
        ),
    ]
