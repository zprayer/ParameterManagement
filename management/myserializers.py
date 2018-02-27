__author__ = 'lenovo'

import json
from django.db import models
from django.core.serializers import serialize,deserialize
from django.db.models.query import QuerySet

class MyEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o,QuerySet):
            return json.loads(serialize('json',o))
        if isinstance(o,models.Model):
            return  json.loads(serialize('json',[o])[1:-1])
        return json.JSONEncoder.default(self,o)