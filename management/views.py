from django.shortcuts import render,HttpResponse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.auth.models import User
from django.contrib import auth
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from management.models import MyUser,Parameter,AircraftInfo,SensorInfo
from django.core.urlresolvers import reverse
from management.utils import permission_check
from django.db.models import Q
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.views.generic import TemplateView,View,ListView,DeleteView
from .forms import *
import json
from  django.forms.models import model_to_dict
from .myserializers import *


class BindSensor(View):
    def get(self,request):
        ret = {}
        parameter_id = request.GET.get('parameter_id',None)
        sensor_id =request.GET.get('sensor_id')
        if parameter_id == 'undefined':
            parameter_id = None
        if sensor_id == 'undefined':
            sensor_id = None
        try:
            parameter_instance = Parameter.objects.get(id = parameter_id)
        except Parameter.DoesNotExist:
            ret['res'] = '参数不存在，请刷新页面检查参数是否已被删除！'
        else:
            try:
                sensor_instance = SensorInfo.objects.get(id = sensor_id)
            except SensorInfo.DoesNotExist:
                ret['res'] = '传感器型号不存在，请查询传感器信息库检查传感器型号！'
            else:
                parameter_instance.sensor = sensor_instance
                parameter_instance.save()
                ret['res'] = '传感器绑定成功！'

        return HttpResponse(json.dumps(ret),content_type='application/json')

class SelectSensor(View):
    def get(self,request):
        search_term = request.GET.get('q')
        res_qs = SensorInfo.objects.filter(sensor_type__contains = search_term).values('id','sensor_type','sensor_name','weight','voltage','power','signal_range','signal_type','comment')
        res_json = json.dumps(list(res_qs))
        return HttpResponse(res_json,content_type='application/json')

class SensorList(TemplateView):
    template_name = 'management/view_sensor_list.html'

class SensorListJson(BaseDatatableView):
    model = SensorInfo
    columns = ['id','sensor_type','sensor_name','weight','voltage','power','signal_range','signal_type','comment']
    order_columns = ['id','sensor_type','sensor_name','weight','voltage','power','signal_range','signal_type','comment']
    max_display_length = 500
    def prepare_results(self, qs):
        data =[]
        for item in qs:
            data.append({str(column) :self.render_column(item, column) for column in self.get_columns()})
        return data

    def filter_queryset(self,qs):
        search =self.request.GET.get('search[value]',None)
        if search:
            qs = qs.filter(Q(sensor_type__contains = search) | Q(sensor_name__contains = search) | Q(weight__contains = search) | Q(voltage__contains = search) | Q(power__contains = search))
        return qs

class AddSensor(View):
    def get(self,request):
        ret = dict()
        ret['ok'] = '0'
        sensor_dic ={}
        sensor_dic['sensor_type'] = request.GET.get('sensor_type',None)
        sensor_dic['sensor_name']= request.GET.get('sensor_name',None)
        sensor_dic['weight']= request.GET.get('weight',None)
        sensor_dic['voltage']= request.GET.get('voltage',None)
        sensor_dic['power']= request.GET.get('power',None)
        sensor_dic['signal_range']=request.GET.get('signal_range',None)
        sensor_dic['signal_type']=request.GET.get('signal_type',None)
        sensor_dic['comment']=request.GET.get('comment',None)
        sensornew = SensorInfo.objects.create_sensor(sensor_dic)
        sensornew.save()
        ret['ok'] = '1'
        return HttpResponse(json.dumps(ret),content_type='application/json')

class RequestSensor(View):
    def get(self,request):
        ret = dict()
        sensor_request = request.GET.get("id")
        qs = SensorInfo.objects.filter(id = sensor_request).values('id',
                                                               'sensor_type',
                                                               'sensor_name',
                                                               'weight',
                                                               'voltage',
                                                               'power',
                                                               'signal_range',
                                                               'signal_type',
                                                               'comment',
                                                               )

        ret['responsedata'] = list(qs)
        ret['res'] = 'ok'
        print(ret)
        return HttpResponse(json.dumps(ret),content_type='application/json')

class ModifySensor(View):
    def get(self,request):
        ret = {}
        sensor_modify_id = request.GET.get('id')
        try:
            sensor_old = SensorInfo.objects.get(id = sensor_modify_id)

        except SensorInfo.DoesNotExist:
            ret['res'] = 'not exist'
        else:
            sensor_new = SensorRequestForm(request.GET,instance=sensor_old)
            sensor_new.save()
            ret['res'] = 'ok'

        return HttpResponse(json.dumps(ret),content_type="application/json")

class DeleteSensor(View):
    def get(self,request):
        ret = dict()
        sensor_del = request.GET.get("id")
        SensorInfo.objects.get(id = sensor_del).delete()
        ret['ok'] = '1'
        return HttpResponse(json.dumps(ret),content_type='application/json')



class ParameterList(TemplateView):
    template_name = 'management/view_parameters_list.html'

class ParameterListJson(BaseDatatableView):
    model = Parameter
    columns = ['id','name','identifier','name_output','unit','system','responsibility','status','sensor.sensor_name','sensor.sensor_type']
    order_columns =['id','name','identifier','name_output','unit','system','responsibility','status','sensor.sensor_name','sensor.sensor_type']
    sensor_columns = ['sensor_type','sensor_name','weight','voltage','power','signal_range','signal_type','comment']
    max_display_length = 500
#    def render_column(self,row,column):
 #       return super(ParameterListJson, self).render_column(row,column)
    #重构prepare_result函数，将原来的[1,2,3,4]的json数据格式变成[{key:value},{key:val},{key:val}]的形式
    def get_initial_queryset(self):
        aircraftinfo_id = self.request.GET.get('aircraftinfo_id',None)
        if not self.model:
            raise NotImplementedError("Need to provide a model or implement get_initial_queryset!")
        return self.model.objects.filter(aircraftinfo__id = aircraftinfo_id)

    def prepare_results(self, qs):
        data = []
        for item in qs:
            data.append({str(column) : self.render_column(item, column) for column in self.get_columns()})
        return data


    def filter_queryset(self,qs):
        search =self.request.GET.get('search[value]',None)
        if search:
            qs = qs.filter(Q(name__contains = search) | Q(identifier__contains = search) | Q(name_output__contains = search) | Q(system__contains = search) | Q(responsibility__contains = search))
        return qs

class DeleteParameter(View):
    def get(self,request):
        ret = dict()
        par_del = request.GET.get("id")
        Parameter.objects.get(id = par_del).delete()
        ret['ok'] = '1'
        return HttpResponse(json.dumps(ret),content_type='application/json')

class AddParameter(View):
    def get(self,request):
        ret = dict()
        ret['ok'] = '0'
        par_dic ={}
        aircraftinfo_id = request.GET.get('aircraftinfo_id',None)
        par_dic['name'] = request.GET.get('name',None)
        par_dic['identifier']= request.GET.get('identifier',None)
        par_dic['name_output']= request.GET.get('name_output',None)
        par_dic['range_min']= request.GET.get('range_min',None)
        par_dic['range_max']= request.GET.get('range_max',None)
        par_dic['unit']=request.GET.get('unit',None)
        par_dic['accuracy']=request.GET.get('accuracy',None)
        par_dic['samplerate']=request.GET.get('samplerate',None)
        par_dic['type']=request.GET.get('type',None)
        par_dic['source']=request.GET.get('source',None)
        par_dic['ground_monitor']=request.GET.get('ground_monitor',None)
        par_dic['airborne_monitor']=request.GET.get('airborne_monitor',None)
        par_dic['system']=request.GET.get('system',None)
        par_dic['responsibility']=request.GET.get('responsibility',None)
        #parnew = Parameter.objects.create(**par_dic)
        parnew = Parameter.objects.create_parameter(par_dic,aircraftinfo_id)
        parnew.save()
        ret['ok'] = '1'
        return HttpResponse(json.dumps(ret),content_type='application/json')

class RequestParameter(View):
    def get(self,request):
        ret = dict()
        par_request = request.GET.get("id")
        qs = Parameter.objects.filter(id = par_request).values('id',
                                                               'name',
                                                               'identifier',
                                                               'name_output',
                                                               'range_min',
                                                               'range_max',
                                                               'unit',
                                                               'accuracy',
                                                               'samplerate',
                                                               'type',
                                                               'source',
                                                               'ground_monitor',
                                                               'airborne_monitor',
                                                               'system',
                                                               'responsibility',
                                                               )

        ret['responsedata'] = list(qs)
        ret['res'] = 'ok'
        return HttpResponse(json.dumps(ret),content_type='application/json')

class ModifyParameter(View):
    def get(self,request):
        ret = {}
        par_modify_id = request.GET.get('id')
        try:
            par_old = Parameter.objects.get(id = par_modify_id)

        except Parameter.DoesNotExist:
            ret['res'] = 'not exist'
        else:
            par_new = ParameterRequestForm(request.GET,instance=par_old)
            par_new.save()
            ret['res'] = 'ok'

        return HttpResponse(json.dumps(ret),content_type="application/json")

class ParameterListEntry(View):
    def get(self,request):
        user = request.user if request.user.is_authenticated() else None
        #添加型号架机的Category查询
        aircraft_model_category = AircraftInfo.objects.values('aircraft_model').distinct()
        aircraft_number_category = AircraftInfo.objects.values('aircraft_number').distinct()
        content ={
            'user':user,
            'aircraft_model_category':aircraft_model_category,
            'aircraft_number_category':aircraft_number_category,
        }
        return render(request,'management/parameterlistentry.html',content)
    def post(self,request):
        user = request.user if request.user.is_authenticated() else None
        aircraft_model = request.POST.get("aircraft_model",None)
        aircraft_number = request.POST.get("aircraft_number",None)
        if aircraft_model and aircraft_number:
            try:
                aircraftinfo = AircraftInfo.objects.get(aircraft_model = aircraft_model,aircraft_number = aircraft_number)
            except AircraftInfo.DoesNotExist:
                content = {
                    'user':user,
                    'res':"aircraftinfo is not correct",
                }
                return render(request,'management/parameterlistentry.html',content)
            else:
                content ={
                    'user':user,
                    'aircraftinfo':aircraftinfo,
                }
                return render(request,'management/view_parameters_list.html',content)

class AddAircraftInfo(View):
    def get(self,request):
        #尚未添加判断架机型号是否已存在
        content = {}
        aircraft_new = AircraftInfoForm(request.GET)
        if aircraft_new.is_valid():
            aircraft_new.save()
            content = {
                'res':"ok"
            }
        else:
            content = {
                'res':aircraft_new.errors
            }
        return HttpResponse(json.dumps(content),content_type="application/json")



def index(request):
    user = request.user if request.user.is_authenticated() else None
    content = {
        'active_menu': 'homepage',
        'user': user,
    }
    return render(request, 'management/index.html', content)


def signup(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse('homepage'))
    state = None
    if request.method == 'POST':
        password = request.POST.get('password', '')
        repeat_password = request.POST.get('repeat_password', '')
        if password == '' or repeat_password == '':
            state = 'empty'
        elif password != repeat_password:
            state = 'repeat_error'
        else:
            username = request.POST.get('username', '')
            if User.objects.filter(username=username):
                state = 'user_exist'
            else:
                new_user = User.objects.create_user(username=username, password=password,
                                                    email=request.POST.get('email', ''))
                new_user.save()
                new_my_user = MyUser(user=new_user, nickname=request.POST.get('nickname', ''))
                new_my_user.save()
                state = 'success'
    content = {
        'active_menu': 'homepage',
        'state': state,
        'user': None,
    }
    return render(request, 'management/signup.html', content)


def login(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse('homepage'))
    state = None
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return HttpResponseRedirect(reverse('homepage'))
        else:
            state = 'not_exist_or_password_error'
    content = {
        'active_menu': 'homepage',
        'state': state,
        'user': None
    }
    return render(request, 'management/login.html', content)


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(reverse('login'))


@login_required
def set_password(request):
    user = request.user
    state = None
    if request.method == 'POST':
        old_password = request.POST.get('old_password', '')
        new_password = request.POST.get('new_password', '')
        repeat_password = request.POST.get('repeat_password', '')
        if user.check_password(old_password):
            if not new_password:
                state = 'empty'
            elif new_password != repeat_password:
                state = 'repeat_error'
            else:
                user.set_password(new_password)
                user.save()
                state = 'success'
        else:
            state = 'password_error'
    content = {
        'user': user,
        'active_menu': 'homepage',
        'state': state,
    }
    return render(request, 'management/set_password.html', content)


@user_passes_test(permission_check)
def add_parameter_bus(request):
    user = request.user
    pass
    return render(request, 'management/add_parameter_bus.html')

def view_parameters_list(request):
    user = request.user if request.user.is_authenticated() else None
    query_category  = request.GET.get('category','analog')
    if(query_category == "analog"):
        parameter_list = Parameter.objects.all()
    else:
         query_category = "analog"
         parameter_list = Parameter.objects.all()

    if request.method =="POST":
        keyword = request.POST.get('keyword', '')
        parameter_list = Parameter.objects.filter(Q(name__contains=keyword) | Q(identifier__contains=keyword)|Q(name_output__contains=keyword))
        query_category = 'analog'

    paginator = Paginator(parameter_list, 5)
    page = request.GET.get('page')
    try:
        parameter_list = paginator.page(page)
    except PageNotAnInteger:
        parameter_list = paginator.page(1)
    except EmptyPage:
        parameter_list = paginator.page(paginator.num_pages)
    content = {
        'user': user,
        'active_menu': 'view_goods',
        'query_category': query_category,
        'parameter_list': parameter_list,
    }
    return render(request, 'management/view_parameters_list.html', content)



def detail(request):
    user = request.user if request.user.is_authenticated() else None
    book_id = request.GET.get('id', '')
    if book_id == '':
        return HttpResponseRedirect(reverse('view_book_list'))
    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        return HttpResponseRedirect(reverse('view_book_list'))
    content = {
        'user': user,
        'active_menu': 'view_book',
        'book': book,
    }
    return render(request, 'management/detail.html', content)


@user_passes_test(permission_check)
def add_parameter(request):
    user = request.user
    state = None
    if request.method == 'POST':
        try:
            new_parameter = Parameter(
                    name = request.POST.get('name', ''),
                    identifier = request.POST.get('identifier', ''),
                    name_output = request.POST.get('name_output', ''),
                    range_min = request.POST.get('range_min', ''),
                    range_max = request.POST.get('range_max', ''),
                    unit = request.POST.get('unit', ''),
                    accuracy = request.POST.get('accuracy', ''),
                    samplerate = request.POST.get('samplerate', ''),
                    type = request.POST.get('type', ''),
                    source = request.POST.get('source', ''),
                    ground_monitor = request.POST.get('ground_monitor', ''),
                    airborne_monitor = request.POST.get('airborne_monitor', ''),
                    system = request.POST.get('system', ''),
                    responsibility = request.POST.get('responsibility', '')
            )
            new_parameter.save()
        except Book.DoesNotExist as e:
            state = 'error'
            print(e)
        else:
            state = 'success'
    content = {
        'user': user,
        'state': state,
        'active_menu': 'add_img',
    }
    return render(request, 'management/add_parameter.html', content)

