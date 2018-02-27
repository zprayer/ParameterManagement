from management.models import Parameter,MyUser
import xadmin
from xadmin import views

class GlobalSetting(object):
    site_title = '测试参数管理后台'
    site_footer = "FTI"

class ParameterAdmin(object):
    list_display = ('name','identifier','name_output')

xadmin.site.register(views.CommAdminView,GlobalSetting)
xadmin.site.register(Parameter)
xadmin.site.register(MyUser)