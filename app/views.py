from django.views.generic import TemplateView
from django.http import JsonResponse
from django.views import View
from app.models import Invitados

import json

class IndexView(TemplateView):
    template_name = 'index.html'

class ConfirmarAsistencia(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        telefono = data.get('telefono')
        es_invitado = Invitados.objects.filter(telefono=telefono).first()

        if es_invitado: 
            es_invitado.confirmado=True
            es_invitado.save()
            nombre = es_invitado.nombre_completo
            return JsonResponse({'status': 'success', 'message': 'Invitado confirmado', 'nombre': nombre})
        else:
            return JsonResponse({'status': 'error', 'message': 'No es invitado'}, status=404)
        

    def get(self, request, *args, **kwargs):
        return JsonResponse({'status': 'ready'}, status=200)