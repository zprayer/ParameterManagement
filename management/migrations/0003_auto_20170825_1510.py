# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-08-25 07:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0002_auto_20160112_2031'),
    ]

    operations = [
        migrations.CreateModel(
            name='Goods',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, verbose_name='物资名称')),
                ('goodsType', models.CharField(choices=[('通用测试设备', '通用测试设备'), ('机载测试设备', '机载测试设备'), ('改装装机设备', '改装装机设备'), ('一般耗材', '一般耗材'), ('电连接器', '电连接器'), ('改装标准件', '改装标准件'), ('非标件', '非标件'), ('成品线缆', '成品线缆'), ('系统物资', '系统物资')], max_length=30, verbose_name='物资类型')),
                ('modelNum', models.CharField(max_length=30, verbose_name='物资型号')),
                ('storageNum', models.CharField(max_length=30, verbose_name='库房编号')),
                ('state', models.CharField(choices=[('在库', '在库'), ('出库', '出库'), ('送校', '送校'), ('故障', '故障'), ('停用', '停用')], max_length=30, verbose_name='库存状态')),
                ('number', models.IntegerField(verbose_name='库存数量')),
                ('location', models.CharField(max_length=100, verbose_name='存放地点')),
                ('department', models.CharField(blank=True, choices=[('机载测试', '机载测试'), ('改装', '改装'), ('数据传输与处理', '数据传输与处理'), ('测试保障', '测试保障')], max_length=30, verbose_name='维护科室')),
                ('meteringNum', models.CharField(blank=True, max_length=30, verbose_name='计量编号')),
                ('useLife', models.DateField(blank=True, null=True, verbose_name='有效期限')),
                ('serialNum', models.CharField(blank=True, max_length=30, verbose_name='出厂编号')),
                ('unit', models.CharField(blank=True, max_length=30, verbose_name='计数单位')),
                ('coreNum', models.IntegerField(blank=True, null=True, verbose_name='芯数')),
                ('measurement', models.CharField(blank=True, max_length=30, verbose_name='度量单位')),
                ('mountingNum', models.CharField(blank=True, max_length=30, verbose_name='装机件号')),
                ('threshold', models.IntegerField(blank=True, null=True, verbose_name='阈值')),
                ('remarks', models.TextField(blank=True, verbose_name='备注')),
            ],
        ),
        migrations.RemoveField(
            model_name='myuser',
            name='nickname',
        ),
        migrations.AddField(
            model_name='myuser',
            name='team',
            field=models.CharField(blank=True, choices=[('机载测试', '机载测试'), ('改装', '改装'), ('数据传输与处理', '数据传输与处理'), ('测试保障', '测试保障')], max_length=15, verbose_name='科室'),
        ),
        migrations.AddField(
            model_name='myuser',
            name='tel',
            field=models.CharField(blank=True, max_length=15, verbose_name='电话'),
        ),
        migrations.AlterField(
            model_name='img',
            name='img',
            field=models.ImageField(upload_to='image/%Y/%m/%d/'),
        ),
    ]
