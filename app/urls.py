from django.urls import path
from .views import IndexView
from .views import ConfirmarAsistencia,SugerirCancionView,ExportSugerenciasExcelView,ExportInvitadosExcelView

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('confirmar-asistencia/', ConfirmarAsistencia.as_view(), name='confirmar_asistencia'),
    path('sugerir-cancion/', SugerirCancionView.as_view(), name='sugerir_cancion'),
    path('exportar-sugerencias/', ExportSugerenciasExcelView.as_view(), name='export_sugerencias_excel'),
    path('exportar-invitados/', ExportInvitadosExcelView.as_view(), name='exportar_invitados'),
]
