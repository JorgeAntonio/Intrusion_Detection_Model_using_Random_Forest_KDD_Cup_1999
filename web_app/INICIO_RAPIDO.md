# 🚀 Inicio Rápido - Gradient Boosting Dashboard

## Opción 1: Scripts Automáticos (Windows)

### Paso 1: Iniciar el Backend
Haz doble clic en:
```
start_backend.bat
```

Esto:
- Creará un entorno virtual (si no existe)
- Instalará las dependencias de Python
- Iniciará el servidor Flask en http://localhost:5000

### Paso 2: Iniciar el Frontend
Haz doble clic en:
```
start_frontend.bat
```

Esto:
- Instalará las dependencias de Node.js (si no existen)
- Iniciará la aplicación React en http://localhost:3000
- Abrirá automáticamente tu navegador

### Paso 3: Usar la Aplicación
1. La aplicación se abrirá en tu navegador
2. Ve a "Cargar Datos"
3. Sube un archivo CSV con datos de red
4. Visualiza los resultados en el dashboard

---

## Opción 2: Instalación Manual

### Backend (Terminal 1)

```bash
# Navegar al backend
cd web_app/backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python app.py
```

### Frontend (Terminal 2)

```bash
# Navegar al frontend
cd web_app/frontend

# Instalar dependencias
npm install

# Iniciar aplicación
npm start
```

---

## 📝 Notas Importantes

1. **Modelo Requerido**: Asegúrate de que el modelo esté entrenado y ubicado en:
   ```
   output/gradient_boosting_kdd_model.joblib
   ```

2. **Puertos**: 
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

3. **Primera Ejecución**: La primera vez puede tomar varios minutos instalando dependencias

4. **Archivo de Prueba**: Puedes usar el archivo de entrenamiento:
   ```
   scripts/KDD_TRAIN_FULL.csv
   ```

---

## 🐛 Solución de Problemas

### "Modelo no encontrado"
Ejecuta primero el entrenamiento:
```bash
cd scripts
python train_gradient_boosting.py
```

### "Puerto en uso"
Cierra otras aplicaciones que usen los puertos 5000 o 3000

### "Error de CORS"
Asegúrate de que ambos servidores estén ejecutándose

---

## 📊 Características del Dashboard

✅ Carga de archivos CSV drag-and-drop  
✅ Predicciones en tiempo real  
✅ Visualización de métricas  
✅ Gráficos interactivos (ROC, Precision-Recall)  
✅ Matriz de confusión  
✅ Reporte de clasificación detallado  
✅ Información del modelo  

---

## 🎯 Próximos Pasos

1. Explora la pestaña "Info del Modelo" para ver las métricas de entrenamiento
2. Carga el archivo de prueba para ver el dashboard completo
3. Experimenta con tus propios datos de red

¡Disfruta analizando datos con Machine Learning! 🚀
