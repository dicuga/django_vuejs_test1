from rest_framework import viewsets
from .models import DeliveryNote
from .serializers import DeliveryNoteSerializer


class DeliveryNoteViewSet(viewsets.ModelViewSet):
    queryset = DeliveryNote.objects.all()
    serializer_class = DeliveryNoteSerializer
