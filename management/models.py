from __future__ import unicode_literals

from django.db import models
from django.db.models import *
from django.contrib.auth.models import User


TEAM_CHOICES = (
    (u'机载测试', u'机载测试'),
    (u'改装', u'改装'),
    (u'数据传输与处理', u'数据传输与处理'),
    (u'测试保障', u'测试保障'),
    )

TYPE_CHOICES = (
    (u'数字量', u'数字量'),
    (u'模拟量', u'模拟量'),
    (u'开关量', u'开关量'),
)
SOURCE_CHOICES = (
    (u'加装', u'加装'),
    (u'抽引', u'抽引'),
)


PARAMETERTYPE =(
    (u'模拟量参数', u'模拟量参数'),
    (u'A429参数', u'A429参数'),
    (u'A664参数', u'A664参数'),
    (u'IMB参数', u'IMB参数'),

)
PARAMETERSTATUS =(
    ('request_validating', u'需求分析'),
    ('request_published', u'需求发布'),
    ('sensor_published', u'传感器选型发布'),
    ('acquisition_published', u'测试采集发布'),

)
class MyUser(models.Model):
    user = models.OneToOneField(User)
    permission = models.IntegerField(default=1)
    tel = models.CharField('电话', max_length=15,blank = True)
    team = models.CharField('科室', max_length = 15, choices = TEAM_CHOICES,blank = True)
    def __unicode__(self):
        return self.user.username

class SensorNumberInfo(models.Model):
    serial_number = models.IntegerField("序列号")
    EDZ_number = models.IntegerField("EDZ区域号")
    part_number = models.CharField("传感器零件号",max_length = 32)

class SensorInfoManager(models.Manager):
    def create_sensor(self,sensordic):
        sensor = self.create(**sensordic)
        return  sensor

class SensorInfo(models.Model):
    sensor_type = models.CharField("型号",max_length = 32)
    sensor_name = models.CharField("传感器名称",max_length = 32)
    weight = models.CharField("重量",max_length=16)
    voltage = models.CharField("供电要求",max_length = 32)
    power = models.CharField("功耗",max_length=16)
    signal_range = models.CharField("输出信号范围",max_length=16)
    signal_type = models.CharField("输出信号类型",max_length = 32)
    comment = models.CharField("备注",max_length= 64,null=True)
    objects = SensorInfoManager()
    #connector_type = models.CharField("接插件型号",max_length = 32)
    #connector_match_type = models.CharField("配对接插件型号",max_length = 32)
    #connector_number = models.CharField("接插件编号",max_length = 32)
    #connector_type_temp = models.CharField("传感器连接器类型号",max_length = 32)
    #sequence_number = models.CharField("顺序号",max_length = 2)
    #wire_guage = models.CharField("线规",max_length = 16)
    #wire_zhi = models.CharField("线制",max_length = 16)
    #wire_sum = models.IntegerField("线缆数量")
    #pin_define = models.CharField("针脚定义",max_length = 256)
    class Meta:
        verbose_name = '传感器'
        verbose_name_plural = '传感器'
class AirbornNumberManager(models.Manager):
    AN_dic = {}
    def create_AN(self,type,aircraft_type,aircraft_num,index):
        if(index):
            self.AN_dic['index'] = index
            #self.AN_dic['index_int'] = int(index)
        else:
            self.AN_dic['errors'] = 'Index is not define'

        if(type =='sensor'):
            self.AN_dic['ATA']='8712'
        elif(type == 'box' or type == 'card'):
            self.AN_dic['ATA']='8716'
        else:
            self.AN_dic['errors'] = self.AN_dic['errors'] + "\rEquipment's type is not define!"
        if(aircraft_type == 'C919'):
            self.AN_dic['aircraft_type'] = 'C'
        elif(aircraft_type == 'ARJ21'):
            self.AN_dic['aircraft_type'] = 'A'
        else:
            self.AN_dic['errors'] = self.AN_dic['errors'] + "\rEquipment's aircraft_type is not define!"
        if(aircraft_num):
            self.AN_dic['aircraft_num'] = aircraft_num[1:]
        else:
            self.AN_dic['errors'] = self.AN_dic['errors'] + "\rEquipment's aircraft_num is not define!"

        self.AN_dic['number'] = self.AN_dic['ATA']+self.AN_dic['aircraft_type'] +self.AN_dic['index'] + self.AN_dic['aircraft_num']
        airborn_num = self.create(**self.AN_dic)

        return airborn_num


class AirbornNumber(models.Model):
    number = models.CharField("装机件号",max_length=16,null=True)
    ATA = models.CharField("ATA章节号",max_length=4,null=True)
    aircraft_type = models.CharField("飞机型号",max_length=1,null=True)
    aircraft_num = models.CharField("飞机架机号",max_length=2,null=True)
    index = models.CharField("流水号",max_length=3,null=True)
    #index_int = models.IntegerField("流水号(int)",null=True)
    objects = AirbornNumberManager()










class PositionInfo(models.Model):
    pass

class SeparationInfo(models.Model):
    pass

class AcquisitionInfo(models.Model):
    pass

class SchematicInfo(models.Model):
    pass

class AircraftInfo(models.Model):
    aircraft_model = models.CharField("飞机型号", max_length=5)
    aircraft_number = models.CharField("架机号", max_length=5)
    class Meta:
        unique_together = (('aircraft_model', 'aircraft_number'),)
        verbose_name = '架机型号'
        verbose_name_plural = '架机型号'

class ParameterManager(models.Manager):
    def create_parameter(self,pardic,aircraft_id):
        par = self.create(**pardic)
        aircraft_instance = AircraftInfo.objects.get(id = aircraft_id)
        par.aircraftinfo = aircraft_instance
        return par

class Parameter(models.Model):
    name = models.CharField("参数名称",max_length = 64)
    identifier = models.CharField("参数符号",max_length = 64)
    name_output = models.CharField("输出符号",max_length = 64)
    range_min = models.CharField("量程最小值",blank = True,null = True,max_length = 64)
    range_max = models.CharField("量程最大值",blank = True,null = True,max_length = 64)
    unit = models.CharField("单位",max_length = 8,blank = True)
    accuracy = models.CharField("精度",blank = True,max_length = 64)
    samplerate = models.CharField("采样率",blank = True,max_length = 64)
    type = models.CharField("参数类型",max_length = 8,choices = TYPE_CHOICES)
    source = models.CharField("参数来源",max_length = 8,choices = SOURCE_CHOICES)
    ground_monitor = models.CharField("地面监控",max_length = 8,null = True)
    airborne_monitor = models.CharField("机载监控",max_length = 8,null = True)
    system = models.CharField("系统/专业",max_length = 16)
    responsibility = models.CharField("负责方",max_length = 16)
    sensor_airborn_number = models.OneToOneField('AirbornNumber',null = True)
    sensor = models.ForeignKey('SensorInfo',null = True)
    position = models.ForeignKey(PositionInfo,null = True)
    acquisitionInfo = models.OneToOneField(AcquisitionInfo,null = True)
    #schematicInfo = models.ForeignKey(SchematicInfo,null = True)
    aircraftinfo = models.ForeignKey('AircraftInfo',null=True)
    status = models.CharField("参数状态",max_length= 20,choices=PARAMETERSTATUS,default="request_validating")
    objects = ParameterManager()
    class Meta:
        verbose_name = '模拟量参数'
        verbose_name_plural = '模拟量参数'









