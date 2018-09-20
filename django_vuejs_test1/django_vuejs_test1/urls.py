from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from .routers import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('articulos', TemplateView.as_view(template_name='index.html')),
    path('grid', TemplateView.as_view(template_name='grid.html')),
    path('api/', include(router.urls)),
]
