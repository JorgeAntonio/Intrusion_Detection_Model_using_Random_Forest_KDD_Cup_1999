# 📁 Estructura del Proyecto Web

```
web_app/
│
├── 📄 README.md                    # Documentación principal
├── 📄 INICIO_RAPIDO.md            # Guía de inicio rápido
├── 📄 EJEMPLO_USO.md              # Ejemplos de uso detallados
├── 📄 ESTRUCTURA.md               # Este archivo
├── 📄 .gitignore                  # Archivos ignorados por Git
│
├── 🚀 start_backend.bat           # Script para iniciar backend (Windows)
├── 🚀 start_frontend.bat          # Script para iniciar frontend (Windows)
│
├── 🔧 backend/                    # Servidor Flask (Python)
│   ├── app.py                     # API REST principal
│   ├── requirements.txt           # Dependencias Python
│   └── venv/                      # Entorno virtual (generado)
│
└── 🎨 frontend/                   # Aplicación React
    ├── public/
    │   └── index.html             # HTML base
    │
    ├── src/
    │   ├── components/            # Componentes React
    │   │   ├── Dashboard.js       # Dashboard con visualizaciones
    │   │   ├── FileUpload.js      # Componente de carga de archivos
    │   │   └── ModelInfo.js       # Información del modelo
    │   │
    │   ├── App.js                 # Componente principal
    │   ├── index.js               # Punto de entrada
    │   └── index.css              # Estilos globales (TailwindCSS)
    │
    ├── package.json               # Dependencias Node.js
    ├── tailwind.config.js         # Configuración TailwindCSS
    ├── postcss.config.js          # Configuración PostCSS
    └── node_modules/              # Módulos Node.js (generado)
```

## 🔍 Descripción de Componentes

### Backend (Flask)

#### `app.py`
Servidor Flask que expone la API REST para:
- ✅ Cargar y servir el modelo Gradient Boosting
- ✅ Realizar predicciones sobre datos CSV
- ✅ Calcular métricas de evaluación
- ✅ Proporcionar información del modelo
- ✅ Servir visualizaciones

**Endpoints principales:**
- `GET /api/health` - Estado del servidor
- `GET /api/model-info` - Información del modelo
- `POST /api/predict` - Realizar predicciones
- `GET /api/feature-importance` - Importancia de características
- `GET /api/plots` - Listar visualizaciones disponibles

### Frontend (React)

#### `App.js`
Componente principal que:
- Gestiona el estado global de la aplicación
- Maneja la navegación entre pestañas
- Coordina la comunicación con el backend
- Muestra alertas y mensajes de error

#### `components/FileUpload.js`
Interfaz de carga de archivos con:
- 📤 Drag & drop de archivos CSV
- 📋 Validación de formato
- 🔄 Indicador de carga
- ℹ️ Instrucciones de uso

#### `components/ModelInfo.js`
Visualización de información del modelo:
- 🧠 Hiperparámetros del modelo
- 📊 Métricas de entrenamiento
- 📈 Rendimiento en conjunto de prueba
- 📝 Descripción del algoritmo

#### `components/Dashboard.js`
Dashboard interactivo con:
- 📊 Tarjetas de resumen (total, normal, ataques)
- 🥧 Gráfico de pie (distribución)
- 📉 Matriz de confusión
- 📈 Curva ROC con AUC
- 📊 Curva Precision-Recall
- 📋 Tabla de clasificación detallada
- ⚠️ Alertas de seguridad

## 🎨 Tecnologías y Librerías

### Backend
```
Flask==3.0.0              # Framework web
flask-cors==4.0.0         # Manejo de CORS
pandas==2.1.4             # Manipulación de datos
numpy==1.26.2             # Operaciones numéricas
scikit-learn==1.3.2       # Machine Learning
joblib==1.3.2             # Serialización de modelos
```

### Frontend
```
react==18.2.0             # Librería UI
axios==1.6.2              # Cliente HTTP
recharts==2.10.3          # Gráficos y visualizaciones
lucide-react==0.294.0     # Iconos
tailwindcss==3.3.6        # Framework CSS
```

## 🔄 Flujo de Datos

```
Usuario
  ↓
[Frontend React]
  ↓ (HTTP Request)
[Backend Flask API]
  ↓
[Modelo Gradient Boosting]
  ↓
[Predicciones + Métricas]
  ↓ (HTTP Response)
[Frontend React]
  ↓
Dashboard Interactivo
```

## 📦 Archivos Generados (No incluidos en Git)

```
backend/
└── venv/                 # Entorno virtual Python
    ├── Scripts/
    ├── Lib/
    └── ...

frontend/
├── node_modules/         # Dependencias Node.js
│   ├── react/
│   ├── axios/
│   └── ...
└── build/               # Build de producción (npm run build)
```

## 🚀 Comandos Útiles

### Backend
```bash
# Activar entorno virtual
cd backend
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python app.py

# Actualizar dependencias
pip freeze > requirements.txt
```

### Frontend
```bash
# Instalar dependencias
cd frontend
npm install

# Iniciar desarrollo
npm start

# Build de producción
npm run build

# Actualizar dependencias
npm update
```

## 📊 Tamaño Aproximado

```
backend/
├── app.py              ~10 KB
├── requirements.txt    ~1 KB
└── venv/              ~50 MB (generado)

frontend/
├── src/               ~50 KB
├── public/            ~5 KB
├── package.json       ~2 KB
└── node_modules/      ~300 MB (generado)
```

## 🔐 Seguridad

### Consideraciones Implementadas
- ✅ CORS configurado para desarrollo local
- ✅ Validación de tipos de archivo
- ✅ Manejo de errores en backend y frontend

### Mejoras Sugeridas para Producción
- 🔒 Implementar autenticación JWT
- 🔒 Validación de tamaño de archivos
- 🔒 Rate limiting en API
- 🔒 HTTPS en producción
- 🔒 Sanitización de inputs
- 🔒 Logs de auditoría

## 📝 Notas Adicionales

### Desarrollo
- Hot reload habilitado en ambos servidores
- Logs detallados en consola
- Source maps para debugging

### Producción
- Compilar frontend: `npm run build`
- Usar servidor WSGI para Flask (Gunicorn)
- Configurar proxy reverso (Nginx)
- Implementar CDN para assets estáticos

---

**Última actualización**: Noviembre 2024
