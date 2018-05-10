from django.conf.urls import url
from management import views

urlpatterns = [
    url(r'^$', views.index, name='homepage'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^login/$', views.login, name='login'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^set_password/$', views.set_password, name='set_password'),
    url(r'^add_parameter_bus/$', views.add_parameter_bus, name='add_parameter_bus'),
    #url(r'^add_parameter/$', views.add_parameter, name='add_parameter'),
    url(r'^view_parameters_list/$', views.ParameterList.as_view(), name='view_parameters_list'),
    url(r'^parameters_list_json/$',views.ParameterListJson.as_view(),name = 'parameter_list_json'),
    url(r'^delete_parameter/$',views.DeleteParameter.as_view(),name='delete_parameter'),
    url(r'^add_parameter/$',views.AddParameter.as_view(),name='add_parameter'),
    url(r'^view_book/detail/$', views.detail, name='detail'),
    url(r'^request_parameter_info/$', views.RequestParameter.as_view(), name='request_parameter_info'),
    url(r'^modify_parameter/$', views.ModifyParameter.as_view(), name='modify_parameter'),
    url(r'^parameterlist_entry/$', views.ParameterListEntry.as_view(), name='parameterlist_entry'),
    url(r'^add_aircraftinfo/$', views.AddAircraftInfo.as_view(), name='add_aircraftinfo'),

    url(r'^change_parameter_permission/$', views.ChangeParameterPermission.as_view(), name='change_parameter_permission'),
    url(r'^delete_parameter_permission/$', views.DeleteParameterPermission.as_view(), name='delete_parameter_permission'),
    url(r'^change_sensor_permission/$', views.ChangeSensorPermission.as_view(), name='change_sensor_permission'),
    url(r'^delete_sensor_permission/$', views.DeleteSensorPermission.as_view(), name='delete_sensor_permission'),
    
    url(r'^sensor_list_json/$', views.SensorListJson.as_view(), name='sensor_list_json'),
    url(r'^view_sensorinfo_list/$', views.SensorList.as_view(), name='view_sensor_list'),
    url(r'^request_sensor_info/$', views.RequestSensor.as_view(), name='request_sensor_info'),
    url(r'^add_sensor/$',views.AddSensor.as_view(),name='add_sensor'),
    url(r'^modify_sensor/$', views.ModifySensor.as_view(), name='modify_sensor'),
    url(r'^delete_sensor/$',views.DeleteSensor.as_view(),name='delete_sensor'),
    url(r'^select_sensor/$',views.SelectSensor.as_view(),name='select_sensor'),
    url(r'^bind_sensor/$',views.BindSensor.as_view(),name='bind_sensor'),
    url(r'^unbind_sensor/$',views.UnBindSensor.as_view(),name='unbind_sensor'),
  url(r'^statistics_parameter/$',views.StatisticsParameter.as_view(),name='statistics_parameter'),
]
