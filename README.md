# Descarga y particionado del dataset DDTrain

Este repositorio contiene un script para descargar un dataset de detección de intrusiones (DDTrain), procesarlo y dividirlo en múltiples archivos CSV.

Archivos añadidos:
- `scripts/download_and_chunk.py`: Script principal para descargar, procesar y dividir el dataset.
- `requirements.txt`: Dependencias necesarias (pandas, numpy, requests).

Uso (PowerShell en Windows):

```powershell
python .\scripts\download_and_chunk.py
```

Notas importantes:
- La URL proporcionada en el enunciado contiene parámetros de firma `X-Goog-Signature` truncados. Si la descarga falla por 403 o URL inválida, reemplace la variable `DATA_URL` en `scripts/download_and_chunk.py` con la URL completa y válida.
- Los archivos CSV generados se guardarán en `chunks/` en la raíz del proyecto (es decir, `scripts/../chunks`).
