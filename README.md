# 🛡️ Modelo de Detección de Intrusiones con Random Forest

Sistema de Machine Learning para detección de intrusiones de red utilizando **Random Forest** sobre el dataset **KDD Cup 1999**. El modelo clasifica el tráfico de red en dos categorías: **Normal** y **Attack** (intrusión).

## 🎯 Características del Proyecto

- **Accuracy**: 99.87%
- **ROC-AUC**: 0.9999
- **Algoritmo**: Random Forest con 121 árboles
- **Dataset**: KDD Cup 1999 (~126,000 muestras)
- **Visualizaciones**: 6 gráficos interactivos (HTML) y estáticos (PNG)

## 📁 Estructura del Proyecto

```
Prueba-dataset/
├── scripts/
│   ├── download_and_chunk.py          # Descarga y preprocesa el dataset
│   ├── train_random_forest.py         # Entrena el modelo Random Forest
│   ├── generate_visualizations.py     # Genera gráficos de rendimiento
│   └── KDD_TRAIN_FULL.csv            # Dataset procesado (generado)
├── output/
│   ├── rf_kdd_model.joblib           # Modelo entrenado (6.4 MB)
│   ├── rf_kdd_metrics.txt            # Métricas de evaluación
│   └── plots/                         # Visualizaciones (PNG + HTML)
├── requirements.txt                   # Dependencias del proyecto
├── README.md                          # Este archivo
└── README_TRAINING.md                 # Documentación técnica detallada
```

## 🚀 Cómo Ejecutar el Proyecto

### **Paso 1: Instalar Dependencias**

```powershell
# Crear entorno virtual (recomendado)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt
```

### **Paso 2: Descargar y Procesar el Dataset**

```powershell
python .\scripts\download_and_chunk.py
```

Este script:
- Descarga el dataset KDD Cup 1999 (DDTrain.txt)
- Aplica one-hot encoding a variables categóricas
- Crea la variable objetivo binaria (0=Normal, 1=Attack)
- Genera `scripts/KDD_TRAIN_FULL.csv` con ~120 características

### **Paso 3: Entrenar el Modelo**

```powershell
python .\scripts\train_random_forest.py
```

Este script:
- Carga el dataset procesado
- Divide los datos en train (80%) y test (20%)
- Optimiza hiperparámetros con RandomizedSearchCV
- Entrena el modelo Random Forest
- Guarda el modelo en `output/rf_kdd_model.joblib`
- Genera métricas en `output/rf_kdd_metrics.txt`

**Tiempo estimado**: 5-10 minutos (depende del hardware)

### **Paso 4: Generar Visualizaciones**

```powershell
python .\scripts\generate_visualizations.py
```

Este script genera 6 visualizaciones:
1. **Matriz de Confusión**: Errores de clasificación
2. **Curva ROC**: Capacidad de discriminación (AUC = 0.9999)
3. **Curva Precision-Recall**: Balance entre precisión y recall
4. **Importancia de Características**: Top 15 features más relevantes
5. **Distribución de Clases**: Balance del dataset
6. **Resumen de Rendimiento**: Comparación de métricas

Los gráficos se guardan en `output/plots/` en formato HTML (interactivo) y PNG (estático).

## 📊 Resultados del Modelo

### **Métricas de Rendimiento**

| Métrica | Valor |
|---------|-------|
| Accuracy | 99.87% |
| Precision | 99.87% |
| Recall | 99.86% |
| F1-Score | 99.86% |
| ROC-AUC | 0.9999 |

### **Matriz de Confusión**

```
                Predicted Normal    Predicted Attack
Actual Normal        13,454              15
Actual Attack           17            11,709
```

- **Falsos Positivos**: 15 (0.1%)
- **Falsos Negativos**: 17 (0.1%)
- **Total de errores**: 32 de 25,195 muestras

### **Hiperparámetros Óptimos**

- `n_estimators`: 121
- `max_depth`: 16
- `max_features`: log2
- `min_samples_split`: 4
- `min_samples_leaf`: 1

## 📚 Documentación Técnica

Para una explicación detallada del código, datos de entrada/salida y análisis de visualizaciones, consulta:

👉 **[README_TRAINING.md](README_TRAINING.md)**

Este documento incluye:
- Descripción completa del proceso de entrenamiento
- Explicación de las 120+ características del dataset
- Interpretación detallada de cada gráfico
- Análisis de resultados y recomendaciones

## 🛠️ Tecnologías Utilizadas

- **Python 3.12**
- **scikit-learn**: Random Forest, métricas, validación cruzada
- **pandas**: Manipulación de datos
- **numpy**: Operaciones numéricas
- **plotly**: Visualizaciones interactivas
- **joblib**: Serialización del modelo

## 📦 Dependencias

```
pandas
numpy
requests
scikit-learn
plotly
kaleido
joblib
```

## ⚠️ Notas Importantes

- **Dataset**: Si la descarga automática falla, coloca el archivo `KDDTrain.txt` en `C:\Users\TU_USUARIO\Desktop\IA DATASET\Datasets\` o actualiza la ruta en `download_and_chunk.py`
- **Memoria**: El entrenamiento requiere ~4-6 GB de RAM
- **Tiempo**: El proceso completo toma aproximadamente 10-15 minutos
- **Modelo guardado**: El archivo `.joblib` pesa ~6.4 MB

## 🎯 Aplicaciones

Este modelo puede ser utilizado para:
- Sistemas de Detección de Intrusiones (IDS)
- Monitoreo de red en tiempo real
- Análisis forense de tráfico de red
- Investigación en ciberseguridad

## 📈 Próximos Pasos

- [ ] Validar con tráfico de red real
- [ ] Implementar detección en tiempo real
- [ ] Agregar más tipos de ataques
- [ ] Optimizar el tamaño del modelo
- [ ] Crear API REST para predicciones

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos y de investigación.

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!**
