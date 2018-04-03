from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from management.models import *


class MyUserInline(admin.StackedInline):
    model = MyUser
    can_delete = False


class UserAdmin(BaseUserAdmin):
    inlines = (MyUserInline,)
    list_display=('id','username','email','is_staff','is_active','last_login','date_joined','first_name','last_name','is_superuser',)
    #raw_id_fields = ("tel",)
class ParameterAdmin(admin.ModelAdmin):
     list_display=('id','name','identifier','name_output','range_min','range_max','unit','accuracy','samplerate','type','source','ground_monitor','airborne_monitor','system','responsibility','status')
     search_fields=('name','identifier','name_output','range_min','range_max','unit','accuracy','samplerate','type','source','ground_monitor','airborne_monitor','system','responsibility','status')
     list_display_links = ('status',)
     list_per_page=10
class SensorInfoAdmin(admin.ModelAdmin):
     list_display=('id','sensor_type','sensor_name','weight','voltage','power','signal_range','signal_type','comment')

     search_fields=('sensor_type','sensor_name','weight','voltage','power','signal_range','signal_type','comment')



admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Parameter, ParameterAdmin)
admin.site.register(SensorInfo, SensorInfoAdmin)
#admin.site.register(ComacUser,UserAdmin)
admin.site.site_header = '参数后台管理'
admin.site.site_title = '参数管理系统'
