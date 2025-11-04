# 🚀 Gradient Boosting Dashboard - Interfaz Web

Aplicación web interactiva para visualizar y utilizar el modelo de Gradient Boosting Machine entrenado para detección de intrusiones en redes.

## 📋 Características

- **Dashboard Interactivo**: Visualización en tiempo real de predicciones y métricas
- **Carga de Archivos**: Interfaz drag-and-drop para subir archivos CSV
- **Análisis Completo**: Predicciones con evaluación de métricas cuando hay etiquetas reales
- **Visualizaciones Avanzadas**:
  - Distribución de predicciones (Normal vs Ataque)
  - Matriz de confusión
  - Curva ROC con AUC
  - Curva Precision-Recall
  - Reporte de clasificación detallado
- **Información del Modelo**: Visualización de hiperparámetros y métricas de entrenamiento

## 🏗️ Arquitectura

```
web_app/
├── backend/                 # Servidor Flask
│   ├── app.py              # API REST para el modelo
│   └── requirements.txt    # Dependencias Python
├── frontend/               # Aplicación React
│   ├── public/            # Archivos estáticos
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   ├── Dashboard.js
│   │   │   ├── FileUpload.js
│   │   │   └── ModelInfo.js
│   │   ├── App.js         # Componente principal
│   │   ├── index.js       # Punto de entrada
│   │   └── index.css      # Estilos globales
│   ├── package.json       # Dependencias Node.js
│   └── tailwind.config.js # Configuración TailwindCSS
└── README.md              # Esta documentación
```

## 🛠️ Instalación

### Prerrequisitos

- Python 3.8+
- Node.js 16+
- npm o yarn

### Backend (Flask)

1. Navega al directorio del backend:
```bash
cd web_app/backend
```

2. Crea un entorno virtual (recomendado):
```bash
python -m venv venv
```

3. Activa el entorno virtual:
- Windows:
  ```bash
  venv\Scripts\activate
  ```
- Linux/Mac:
  ```bash
  source venv/bin/activate
  ```

4. Instala las dependencias:
```bash
pip install -r requirements.txt
```

### Frontend (React)

1. Navega al directorio del frontend:
```bash
cd web_app/frontend
```

2. Instala las dependencias:
```bash
npm install
```

## 🚀 Ejecución

### 1. Iniciar el Backend

Desde el directorio `web_app/backend`:

```bash
python app.py
```

El servidor Flask se iniciará en `http://localhost:5000`

### 2. Iniciar el Frontend

Desde el directorio `web_app/frontend`:

```bash
npm start
```

La aplicación React se abrirá automáticamente en `http://localhost:3000`

## 📊 Uso

### 1. Cargar Datos

- Haz clic en la pestaña "Cargar Datos"
- Arrastra y suelta un archivo CSV o haz clic para seleccionarlo
- El archivo debe tener las mismas características usadas en el entrenamiento
- Opcionalmente puede incluir la columna `binario` con etiquetas reales para evaluación

### 2. Ver Información del Modelo

- Haz clic en la pestaña "Info del Modelo"
- Visualiza los hiperparámetros y métricas de entrenamiento
- Revisa el rendimiento del modelo en el conjunto de prueba

### 3. Analizar Resultados

- Después de cargar un archivo, automáticamente verás el dashboard de resultados
- Explora las diferentes visualizaciones:
  - **Resumen**: Total de muestras, tráfico normal y ataques detectados
  - **Distribución**: Gráfico de pie con la proporción de predicciones
  - **Matriz de Confusión**: Si hay etiquetas reales
  - **Curvas ROC y PR**: Evaluación del rendimiento
  - **Reporte de Clasificación**: Métricas detalladas por clase

## 🔌 API Endpoints

El backend expone los siguientes endpoints:

### `GET /api/health`
Verifica el estado del servidor

### `GET /api/model-info`
Obtiene información del modelo cargado

### `POST /api/predict`
Realiza predicciones sobre datos cargados
- **Body**: FormData con archivo CSV
- **Response**: Predicciones y métricas (si hay etiquetas)

### `GET /api/feature-importance`
Obtiene la importancia de características del modelo

### `GET /api/plots`
Lista los plots HTML disponibles

### `GET /api/plot/<filename>`
Obtiene el contenido HTML de un plot específico

## 🎨 Tecnologías Utilizadas

### Backend
- **Flask**: Framework web ligero
- **scikit-learn**: Machine Learning
- **pandas**: Manipulación de datos
- **joblib**: Serialización del modelo

### Frontend
- **React**: Librería UI
- **TailwindCSS**: Framework CSS
- **Recharts**: Visualizaciones de datos
- **Axios**: Cliente HTTP
- **Lucide React**: Iconos

## 📝 Formato del Archivo CSV

El archivo CSV debe contener:
- Las mismas características numéricas usadas en el entrenamiento
- Opcionalmente, la columna `binario` con valores 0 (normal) o 1 (ataque)

Ejemplo:
```csv
feature_0,feature_1,feature_2,...,binario
0.5,1.2,0.8,...,0
0.3,2.1,1.5,...,1
```

## 🔧 Configuración

### Cambiar el Puerto del Backend

Edita `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Cambia el puerto aquí
```

### Cambiar la URL del API en el Frontend

Edita `frontend/src/App.js`:
```javascript
const API_URL = 'http://localhost:5000/api';  // Cambia la URL aquí
```

## 🐛 Solución de Problemas

### Error de CORS
Si ves errores de CORS, asegúrate de que Flask-CORS esté instalado:
```bash
pip install flask-cors
```

### Modelo no encontrado
Verifica que el modelo esté en la ruta correcta:
```
Prueba-dataset/output/gradient_boosting_kdd_model.joblib
```

### Puerto en uso
Si el puerto 5000 o 3000 está en uso, cambia los puertos en la configuración.

## 📈 Métricas del Modelo

El modelo Gradient Boosting actual tiene las siguientes métricas:
- **Accuracy**: 99.94%
- **ROC AUC**: 99.99%
- **F1-Score (CV)**: 99.93%

## 🤝 Contribuciones

Para contribuir al proyecto:
1. Haz fork del repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

## 📄 Licencia

Este proyecto es parte del sistema de detección de intrusiones con Machine Learning.

## 👥 Autores

Desarrollado como parte del proyecto de análisis del KDD Dataset con Gradient Boosting Machine.

---

**Nota**: Asegúrate de tener el modelo entrenado antes de ejecutar la aplicación web. Si no lo tienes, ejecuta primero `scripts/train_gradient_boosting.py`.
