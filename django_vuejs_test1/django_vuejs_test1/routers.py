from rest_framework import routers
from articulos.viewsets import DeliveryNoteViewSet

router = routers.DefaultRouter()
router.register(r'deliverynote', DeliveryNoteViewSet)
