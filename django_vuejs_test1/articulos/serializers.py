from rest_framework import serializers
from .models import DeliveryNote


class DeliveryNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeliveryNote
        fields = '__all__'
