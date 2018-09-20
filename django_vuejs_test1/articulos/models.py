from django.db import models


# Create your models here.
class DeliveryNote(models.Model):
    route = models.CharField(max_length=20)
    date = models.DateField()
    hour = models.CharField(max_length=5)
    delivery_note = models.CharField(max_length=20)
    deliveried = models.BooleanField(default=False)
    sales_order = models.CharField(max_length=20, null=True)
    comments = models.TextField(null=True)
