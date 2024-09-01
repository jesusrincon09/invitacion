from django.urls import path
from .views import IndexView
from .views import ConfirmarAsistencia

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('confirmar-asistencia/', ConfirmarAsistencia.as_view(), name='confirmar_asistencia'),
]
