# 🚀 Proyecto Completo - Gradient Boosting Network Analyzer

Sistema completo de detección de intrusiones en redes usando Machine Learning con **tres interfaces diferentes**: Aplicación Web, Extensión de Chrome y Scripts Python.

---

## 📋 Índice General

1. [Descripción General](#-descripción-general)
2. [Componentes del Proyecto](#-componentes-del-proyecto)
3. [Instalación Rápida](#-instalación-rápida)
4. [Uso](#-uso)
5. [Arquitectura](#-arquitectura)
6. [Documentación](#-documentación)

---

## 🎯 Descripción General

Este proyecto implementa un sistema completo de detección de intrusiones en redes utilizando **Gradient Boosting Machine Learning**. El modelo ha sido entrenado con el dataset KDD Cup 1999 y alcanza una precisión del **99.94%**.

### Características Principales

- 🤖 **Modelo de ML**: Gradient Boosting Classifier optimizado
- 📊 **Precisión**: 99.94% accuracy, 99.99% ROC AUC
- 🌐 **Aplicación Web**: Dashboard interactivo con React
- 🔌 **Extensión Chrome**: Análisis rápido desde el navegador
- 📈 **Visualizaciones**: Gráficos interactivos con Plotly y Recharts
- 🔄 **API REST**: Backend Flask para integración

---

## 📦 Componentes del Proyecto

### 1. 🧠 Modelo de Machine Learning

**Ubicación**: `scripts/train_gradient_boosting.py`

- Gradient Boosting Classifier
- 70 estimadores, learning rate 0.1224
- Entrenado con dataset KDD Cup 1999
- Métricas: 99.94% accuracy, 99.99% ROC AUC

**Archivos de salida**:
- `output/gradient_boosting_kdd_model.joblib` - Modelo entrenado
- `output/gradient_boosting_kdd_metrics.txt` - Métricas
- `output/plots/` - Visualizaciones

### 2. 🌐 Aplicación Web (React + Flask)

**Ubicación**: `web_app/`

#### Backend (Flask)
- API REST completa
- Carga y sirve el modelo
- Procesa predicciones
- Calcula métricas en tiempo real

#### Frontend (React)
- Dashboard interactivo
- Carga de archivos drag & drop
- Visualizaciones con Recharts
- Diseño moderno con TailwindCSS

**Características**:
- 📤 Carga de archivos CSV
- 📊 Dashboard con gráficos interactivos
- 📈 Curvas ROC y Precision-Recall
- 🎯 Matriz de confusión
- 📋 Reporte de clasificación detallado

### 3. 🔌 Extensión de Chrome

**Ubicación**: `chrome_extension/`

- Análisis rápido desde el navegador
- Popup compacto y funcional
- Notificaciones de amenazas
- Historial de análisis
- Integración con el backend

**Características**:
- ⚡ Acceso con un clic
- 📊 Resultados instantáneos
- 🔔 Notificaciones automáticas
- 💾 Historial local
- 🎨 Diseño moderno

---

## ⚡ Instalación Rápida

### Prerrequisitos

```bash
# Python 3.8+
python --version

# Node.js 16+ (solo para aplicación web)
node --version

# Pip
pip --version
```

### Opción 1: Solo Backend + Extensión Chrome (Recomendado)

```bash
# 1. Entrenar el modelo (si no existe)
cd scripts
python train_gradient_boosting.py

# 2. Iniciar backend
cd ../web_app/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py

# 3. Instalar extensión
cd ../../chrome_extension
python create_icons.py
# Luego cargar en Chrome (chrome://extensions/)
```

### Opción 2: Sistema Completo (Web + Extensión)

```bash
# 1. Backend
cd web_app
start_backend.bat  # Windows

# 2. Frontend
start_frontend.bat  # Windows

# 3. Extensión
cd ../chrome_extension
python create_icons.py
# Cargar en Chrome
```

---

## 🚀 Uso

### 1. Aplicación Web

```bash
# Iniciar backend y frontend
cd web_app
start_backend.bat
start_frontend.bat

# Abrir navegador
http://localhost:3000
```

**Flujo**:
1. Cargar archivo CSV
2. Click en "Analizar"
3. Ver dashboard con resultados

### 2. Extensión de Chrome

```bash
# Asegúrate de que el backend esté ejecutándose
cd web_app/backend
python app.py
```

**Flujo**:
1. Click en el ícono de la extensión
2. Cargar archivo CSV
3. Click en "Analizar"
4. Ver resultados en el popup

### 3. Scripts Python

```bash
# Entrenar modelo
cd scripts
python train_gradient_boosting.py

# Generar visualizaciones
python generate_visualizations.py

# Comparar modelos
python compare_models.py
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                     USUARIO                              │
└────────────┬────────────────────────────┬───────────────┘
             │                            │
             ▼                            ▼
    ┌────────────────┐         ┌──────────────────┐
    │  Aplicación    │         │   Extensión      │
    │     Web        │         │   de Chrome      │
    │   (React)      │         │   (Popup)        │
    └────────┬───────┘         └────────┬─────────┘
             │                          │
             └──────────┬───────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   Backend API    │
              │    (Flask)       │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Modelo ML       │
              │  (Gradient       │
              │   Boosting)      │
              └──────────────────┘
```

### Flujo de Datos

1. **Usuario** carga archivo CSV
2. **Frontend/Extensión** envía a API
3. **Backend** procesa con modelo
4. **Modelo** genera predicciones
5. **Backend** calcula métricas
6. **Frontend/Extensión** visualiza resultados

---

## 📚 Documentación

### Documentación Principal

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| **Proyecto** | [PROYECTO_COMPLETO.md](PROYECTO_COMPLETO.md) | Este archivo |
| **Web App** | [web_app/README.md](web_app/README.md) | Documentación completa de la app web |
| **Extensión** | [chrome_extension/README.md](chrome_extension/README.md) | Documentación de la extensión |
| **Scripts** | [README_TRAINING.md](README_TRAINING.md) | Entrenamiento de modelos |

### Guías de Inicio Rápido

| Guía | Ubicación | Para quién |
|------|-----------|------------|
| Inicio Rápido Web | [web_app/INICIO_RAPIDO.md](web_app/INICIO_RAPIDO.md) | Usuarios de la app web |
| Instalación Extensión | [chrome_extension/INSTALACION.md](chrome_extension/INSTALACION.md) | Usuarios de Chrome |
| Ejemplos de Uso | [web_app/EJEMPLO_USO.md](web_app/EJEMPLO_USO.md) | Casos de uso prácticos |

### Documentación Técnica

| Documento | Ubicación | Contenido |
|-----------|-----------|-----------|
| Estructura Web | [web_app/ESTRUCTURA.md](web_app/ESTRUCTURA.md) | Arquitectura de la app web |
| Guía Visual | [web_app/CAPTURAS_PANTALLA.md](web_app/CAPTURAS_PANTALLA.md) | Representaciones visuales |
| Comparación Modelos | [README_COMPARISON.md](README_COMPARISON.md) | Comparación de algoritmos |

---

## 🎯 Casos de Uso

### 1. Análisis en Tiempo Real (Extensión)
**Escenario**: Analista de seguridad monitoreando red

```
1. Exportar logs de red a CSV
2. Abrir extensión de Chrome
3. Cargar archivo
4. Ver resultados instantáneos
5. Recibir notificación si hay amenazas
```

### 2. Análisis Detallado (Aplicación Web)
**Escenario**: Auditoría de seguridad completa

```
1. Recopilar datos de tráfico de red
2. Abrir aplicación web
3. Cargar archivo CSV
4. Explorar dashboard interactivo
5. Analizar gráficos y métricas
6. Exportar resultados
```

### 3. Investigación Forense (Scripts)
**Escenario**: Análisis post-incidente

```
1. Preparar datos históricos
2. Ejecutar scripts de análisis
3. Generar visualizaciones
4. Comparar con otros modelos
5. Documentar hallazgos
```

---

## 📊 Métricas del Modelo

### Rendimiento

| Métrica | Valor |
|---------|-------|
| **Accuracy** | 99.94% |
| **ROC AUC** | 99.99% |
| **F1-Score (CV)** | 99.93% |
| **Precision (Normal)** | 99.96% |
| **Recall (Normal)** | 99.93% |
| **Precision (Ataque)** | 99.92% |
| **Recall (Ataque)** | 99.96% |

### Matriz de Confusión

```
                Predicción
              Normal  Ataque
Real Normal   13460      9
     Ataque      5   11721
```

---

## 🔧 Configuración

### Variables de Entorno

```bash
# Backend
API_PORT=5000
API_HOST=0.0.0.0

# Frontend
REACT_APP_API_URL=http://localhost:5000/api

# Extensión
API_URL=http://localhost:5000/api
```

### Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend Flask | 5000 | http://localhost:5000 |
| Frontend React | 3000 | http://localhost:3000 |
| Extensión | - | Usa backend en 5000 |

---

## 🐛 Solución de Problemas

### Problema: "Modelo no encontrado"

**Solución**:
```bash
cd scripts
python train_gradient_boosting.py
```

### Problema: "API no disponible" (Extensión)

**Solución**:
```bash
cd web_app/backend
python app.py
```

### Problema: "Error de versión de scikit-learn"

**Solución**:
```bash
pip install scikit-learn==1.7.2
```

### Problema: "Puerto en uso"

**Solución**:
```bash
# Cambiar puerto en backend/app.py
app.run(port=5001)  # Cambiar 5000 a 5001
```

---

## 🚀 Roadmap

### Versión Actual (1.0)
- ✅ Modelo Gradient Boosting entrenado
- ✅ Aplicación web completa
- ✅ Extensión de Chrome funcional
- ✅ API REST documentada
- ✅ Visualizaciones interactivas

### Próxima Versión (1.1)
- [ ] Análisis de múltiples archivos
- [ ] Exportar resultados a PDF
- [ ] Modo oscuro
- [ ] Configuración de umbrales
- [ ] Integración con sistemas SIEM

### Futuro (2.0)
- [ ] Análisis en tiempo real
- [ ] Machine Learning continuo
- [ ] Dashboard de tendencias
- [ ] Alertas por email/SMS
- [ ] API pública

---

## 🤝 Contribuir

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature
3. **Desarrolla** y prueba
4. **Documenta** tus cambios
5. **Envía** un pull request

### Áreas de Contribución

- 🐛 Reportar bugs
- ✨ Nuevas características
- 📝 Mejorar documentación
- 🎨 Diseño UI/UX
- 🧪 Tests y validación
- 🌍 Traducciones

---

## 📄 Licencia

Proyecto educativo - KDD Dataset Analysis

---

## 👥 Créditos

- **Dataset**: KDD Cup 1999
- **Algoritmo**: Gradient Boosting (scikit-learn)
- **Framework Web**: React + Flask
- **Visualizaciones**: Plotly, Recharts
- **Estilos**: TailwindCSS

---

## 📞 Soporte

### Recursos

1. **Documentación**: Lee los archivos README en cada carpeta
2. **Issues**: Reporta problemas con detalles específicos
3. **Ejemplos**: Revisa [EJEMPLO_USO.md](web_app/EJEMPLO_USO.md)

### Información para Reportar Problemas

- Sistema operativo y versión
- Versión de Python/Node.js
- Componente afectado (Web/Extensión/Scripts)
- Mensaje de error completo
- Pasos para reproducir

---

## 🎉 ¡Empezar Ahora!

### Opción 1: Extensión de Chrome (Más Rápido)
```bash
cd chrome_extension
python create_icons.py
# Cargar en chrome://extensions/
```

### Opción 2: Aplicación Web (Más Completo)
```bash
cd web_app
start_backend.bat
start_frontend.bat
```

### Opción 3: Scripts Python (Más Flexible)
```bash
cd scripts
python train_gradient_boosting.py
```

---

**¡Disfruta analizando tráfico de red con Machine Learning!** 🚀

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2024
