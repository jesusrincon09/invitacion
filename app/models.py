from django.db import models

# Create your models here.
class Invitados(models.Model):
    nombre_completo = models.CharField(max_length=255)
    telefono = models.CharField(max_length=15)
    confirmado = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre_completo
    
class SugerenciaCancion(models.Model):
    nombre_usuario = models.CharField(max_length=100)
    nombre_cancion_autor = models.CharField(max_length=255)
    link = models.URLField(max_length=500)

    def __str__(self):
        return f"{self.nombre_cancion_autor}"