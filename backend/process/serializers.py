from rest_framework import serializers
from .models import Process




class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Process
        exclude = ('_previous_sector', '_obs')


class ProcessSerializerPut(serializers.ModelSerializer):
    class Meta:
        model = Process
        exclude = ('_previous_sector', '_user', '_obs')