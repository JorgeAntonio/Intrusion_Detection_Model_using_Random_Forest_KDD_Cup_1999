# 🛡️ Sistema de Detección de Intrusiones con Machine Learning

Sistema de Machine Learning para detección de intrusiones de red utilizando **múltiples algoritmos** sobre el dataset **KDD Cup 1999**. El sistema clasifica el tráfico de red en dos categorías: **Normal** y **Attack** (intrusión).

## 🎯 Características del Proyecto

- **4 Modelos de ML**: Random Forest, AdaBoost, Gradient Boosting, Voting Classifier
- **Accuracy**: >99.8% en todos los modelos
- **ROC-AUC**: >0.999 en todos los modelos
- **Dataset**: KDD Cup 1999 (~126,000 muestras)
- **Comparación completa**: Métricas, visualizaciones y análisis comparativo
- **Visualizaciones**: 15+ gráficos interactivos (HTML) y estáticos (PNG)

## 📁 Estructura del Proyecto

```
Prueba-dataset/
├── scripts/
│   ├── download_and_chunk.py          # Descarga y preprocesa el dataset
│   ├── train_random_forest.py         # Entrena Random Forest
│   ├── train_adaboost.py              # Entrena AdaBoost
│   ├── train_gradient_boosting.py     # Entrena Gradient Boosting
│   ├── train_voting_classifier.py     # Entrena Voting Classifier
│   ├── train_all_models.py            # Entrena TODOS los modelos
│   ├── compare_models.py              # Compara todos los modelos
│   ├── visualize_comparison.py        # Visualizaciones comparativas
│   ├── generate_visualizations.py     # Visualizaciones individuales
│   └── KDD_TRAIN_FULL.csv            # Dataset procesado (generado)
├── output/
│   ├── *_kdd_model.joblib            # Modelos entrenados (4 archivos)
│   ├── *_kdd_metrics.txt             # Métricas individuales (4 archivos)
│   ├── models_comparison.txt/csv     # Comparación de modelos
│   ├── plots/                         # Visualizaciones individuales
│   └── comparison_plots/              # Visualizaciones comparativas
├── requirements.txt                   # Dependencias del proyecto
├── README.md                          # Este archivo
├── README_TRAINING.md                 # Documentación técnica detallada
└── README_COMPARISON.md               # Guía de comparación de modelos
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

### **Paso 3: Entrenar Modelos**

#### **Opción A: Entrenar TODOS los modelos (Recomendado)**

```powershell
python .\scripts\train_all_models.py
```

Este script ejecuta automáticamente:
1. Entrenamiento de Random Forest
2. Entrenamiento de AdaBoost
3. Entrenamiento de Gradient Boosting
4. Entrenamiento de Voting Classifier
5. Comparación de todos los modelos
6. Generación de visualizaciones comparativas

**Tiempo estimado**: 30-60 minutos

#### **Opción B: Entrenar modelos individualmente**

```powershell
# Random Forest (5-10 min)
python .\scripts\train_random_forest.py

# AdaBoost (10-15 min)
python .\scripts\train_adaboost.py

# Gradient Boosting (15-20 min)
python .\scripts\train_gradient_boosting.py

# Voting Classifier (20-30 min)
python .\scripts\train_voting_classifier.py
```

### **Paso 4: Comparar Modelos**

```powershell
# Generar comparación detallada
python .\scripts\compare_models.py

# Generar visualizaciones comparativas
python .\scripts\visualize_comparison.py
```

Esto genera:
- **Tabla comparativa** con todas las métricas
- **7 visualizaciones** comparando los modelos
- **Ranking** de modelos por rendimiento
- **Análisis de errores** (FP, FN, tasas)

### **Paso 5: Visualizaciones Individuales (Opcional)**

```powershell
python .\scripts\generate_visualizations.py
```

Genera 6 visualizaciones para Random Forest:
1. **Matriz de Confusión**: Errores de clasificación
2. **Curva ROC**: Capacidad de discriminación
3. **Curva Precision-Recall**: Balance entre precisión y recall
4. **Importancia de Características**: Top 15 features
5. **Distribución de Clases**: Balance del dataset
6. **Resumen de Rendimiento**: Métricas principales

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

### 📖 **[README_TRAINING.md](README_TRAINING.md)** - Documentación de Entrenamiento
- Descripción completa del proceso de entrenamiento
- Explicación de las 120+ características del dataset
- Interpretación detallada de cada gráfico
- Análisis de resultados y recomendaciones

### 🔬 **[README_COMPARISON.md](README_COMPARISON.md)** - Guía de Comparación de Modelos
- Descripción de los 4 modelos implementados
- Ventajas y desventajas de cada algoritmo
- Métricas de comparación y criterios de selección
- Interpretación de visualizaciones comparativas
- Recomendaciones para producción

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
- **Tiempo**: 
  - Un solo modelo: 5-20 minutos
  - Todos los modelos: 30-60 minutos
- **Modelos guardados**: Cada archivo `.joblib` pesa entre 2-10 MB

## 🎯 Aplicaciones

Este modelo puede ser utilizado para:
- Sistemas de Detección de Intrusiones (IDS)
- Monitoreo de red en tiempo real
- Análisis forense de tráfico de red
- Investigación en ciberseguridad

## 📈 Próximos Pasos

- [ ] Validar con tráfico de red real
- [ ] Implementar detección en tiempo real
- [ ] Agregar más algoritmos (XGBoost, LightGBM, Neural Networks)
- [ ] Optimizar hiperparámetros con Optuna o Hyperopt
- [ ] Crear API REST para predicciones
- [ ] Implementar explicabilidad con SHAP o LIME
- [ ] Desplegar en producción con Docker

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos y de investigación.

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!**
