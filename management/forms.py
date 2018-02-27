from django import forms
from .models import *

class ParameterRequestForm(forms.ModelForm):
    class Meta:
        model = Parameter
        fields = ['name','identifier','name_output','range_min','range_max','unit','accuracy','samplerate','type','source','ground_monitor','airborne_monitor','system','responsibility','aircraftinfo']

class ParameterAircraftInfoForm(forms.ModelForm):
    class Meta:
        model = Parameter
        fields = ['aircraftinfo']

class AircraftInfoForm(forms.ModelForm):
    class Meta:
        model = AircraftInfo
        fields = ['aircraft_model','aircraft_number']

class SensorRequestForm(forms.ModelForm):
    class Meta:
        model = SensorInfo
        fields = ['sensor_type','sensor_name','weight','voltage','power','signal_range','signal_type','comment']
