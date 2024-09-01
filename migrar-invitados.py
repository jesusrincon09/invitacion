import os
import django
import pandas as pd
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'invitacion.settings') 
django.setup()

from app.models import Invitados 

try:
    archivo_excel = settings.BASE_DIR / 'tmp' / 'listainvitados.xlsx'
    df = pd.read_excel(archivo_excel)

    for index, row in df.iterrows():
        nombre_completo = row['Nombre completo']
        telefono = row['Telefono']
        invitado = Invitados(nombre_completo=nombre_completo, telefono=telefono)
        invitado.save()

    print("Los invitados han sido cargados exitosamente.")

except FileNotFoundError:
    print(f"Error: El archivo '{archivo_excel}' no fue encontrado.")
except pd.errors.EmptyDataError:
    print(f"Error: El archivo '{archivo_excel}' está vacío.")
except pd.errors.ParserError:
    print(f"Error: El archivo '{archivo_excel}' tiene un formato incorrecto.")
except Exception as e:
    print(f"Ha ocurrido un error inesperado: {e}")
