# 🔬 Comparación de Modelos de Machine Learning

## 📋 Descripción General

Este documento describe la comparación de **4 modelos de Machine Learning** aplicados al problema de detección de intrusiones en redes usando el dataset KDD Cup 1999.

## 🤖 Modelos Implementados

### 1️⃣ **Random Forest (RF)**
- **Tipo**: Ensemble de árboles de decisión
- **Características**:
  - 121 árboles de decisión
  - Votación mayoritaria
  - Manejo de desbalance con `class_weight='balanced'`
  - Optimización con RandomizedSearchCV

**Ventajas**:
- ✅ Robusto contra overfitting
- ✅ Maneja bien características no lineales
- ✅ Proporciona importancia de características
- ✅ Paralelizable

**Desventajas**:
- ❌ Modelo grande (6.4 MB)
- ❌ Menos interpretable que un solo árbol

---

### 2️⃣ **AdaBoost (ADA)**
- **Tipo**: Adaptive Boosting
- **Características**:
  - Estimador base: Decision Tree (max_depth=3)
  - Algoritmo SAMME.R (por defecto en scikit-learn 1.6+)
  - Ajuste adaptativo de pesos
  - Learning rate optimizado

**Ventajas**:
- ✅ Enfoque en muestras difíciles
- ✅ Reduce sesgo y varianza
- ✅ Menos propenso a overfitting que otros boosting

**Desventajas**:
- ❌ Sensible a ruido y outliers
- ❌ Entrenamiento secuencial (no paralelizable)

---

### 3️⃣ **Gradient Boosting Machine (GBM)**
- **Tipo**: Gradient Boosting
- **Características**:
  - Optimización por gradiente descendente
  - Subsample para regularización
  - Control fino de profundidad y learning rate

**Ventajas**:
- ✅ Excelente rendimiento predictivo
- ✅ Maneja bien interacciones complejas
- ✅ Control preciso del overfitting

**Desventajas**:
- ❌ Entrenamiento más lento
- ❌ Requiere más tuning de hiperparámetros
- ❌ Sensible a la elección de learning rate

---

### 4️⃣ **Voting Classifier (VC)**
- **Tipo**: Ensemble de múltiples modelos
- **Características**:
  - Combina: Random Forest + GBM + AdaBoost + Logistic Regression
  - Votación suave (soft voting) usando probabilidades
  - Aprovecha fortalezas de cada modelo

**Ventajas**:
- ✅ Reduce varianza de predicciones
- ✅ Más robusto que modelos individuales
- ✅ Combina diferentes enfoques

**Desventajas**:
- ❌ Modelo más pesado
- ❌ Entrenamiento más lento (4 modelos)
- ❌ Menos interpretable

---

## 🚀 Cómo Ejecutar la Comparación

### **Opción 1: Entrenar Todos los Modelos Automáticamente**

```powershell
# Entrena los 4 modelos, compara y genera visualizaciones
python .\scripts\train_all_models.py
```

Este script ejecuta:
1. Entrenamiento de Random Forest
2. Entrenamiento de AdaBoost
3. Entrenamiento de Gradient Boosting
4. Entrenamiento de Voting Classifier
5. Comparación de todos los modelos
6. Generación de visualizaciones comparativas

**Tiempo estimado**: 30-60 minutos

---

### **Opción 2: Entrenar Modelos Individualmente**

```powershell
# 1. Random Forest
python .\scripts\train_random_forest.py

# 2. AdaBoost
python .\scripts\train_adaboost.py

# 3. Gradient Boosting
python .\scripts\train_gradient_boosting.py

# 4. Voting Classifier
python .\scripts\train_voting_classifier.py

# 5. Comparar modelos
python .\scripts\compare_models.py

# 6. Generar visualizaciones
python .\scripts\visualize_comparison.py
```

---

## 📊 Métricas de Comparación

Los modelos se comparan usando las siguientes métricas:

### **Métricas de Clasificación**
- **Accuracy**: Proporción de predicciones correctas
- **Precision**: Proporción de predicciones positivas correctas
- **Recall**: Proporción de positivos reales detectados
- **F1-Score**: Media armónica de precision y recall
- **ROC-AUC**: Área bajo la curva ROC

### **Análisis de Errores**
- **Falsos Positivos (FP)**: Tráfico normal clasificado como ataque
- **Falsos Negativos (FN)**: Ataques no detectados
- **Tasa de Error**: Proporción de predicciones incorrectas
- **FP Rate**: Tasa de falsos positivos
- **FN Rate**: Tasa de falsos negativos

### **Rendimiento**
- **Tiempo de Predicción**: Tiempo para predecir el conjunto de prueba
- **Muestras/segundo**: Throughput del modelo

---

## 📈 Visualizaciones Generadas

El script `visualize_comparison.py` genera 7 visualizaciones:

### 1. **Comparación de Métricas** (`metrics_comparison.png/html`)
Gráfico de barras agrupadas comparando Accuracy, Precision, Recall, F1-Score y ROC-AUC.

### 2. **Comparación de Errores** (`errors_comparison.png/html`)
Gráfico de barras mostrando Falsos Positivos y Falsos Negativos de cada modelo.

### 3. **Matrices de Confusión** (`confusion_matrices.png/html`)
Grid con las matrices de confusión de todos los modelos lado a lado.

### 4. **Radar de Rendimiento** (`performance_radar.png/html`)
Gráfico de radar multidimensional comparando todas las métricas.

### 5. **Comparación de Tiempos** (`time_comparison.png/html`)
Gráfico de barras mostrando el tiempo de predicción de cada modelo.

### 6. **Tabla de Ranking** (`ranking_table.png/html`)
Tabla visual ordenada por F1-Score con colores de medallas.

### 7. **Tasas de Error** (`error_rates.png/html`)
Gráfico comparando las tasas porcentuales de FP y FN.

---

## 📁 Archivos Generados

```
output/
├── Modelos entrenados (.joblib)
│   ├── rf_kdd_model.joblib
│   ├── adaboost_kdd_model.joblib
│   ├── gradient_boosting_kdd_model.joblib
│   └── voting_classifier_kdd_model.joblib
│
├── Métricas individuales (.txt)
│   ├── rf_kdd_metrics.txt
│   ├── adaboost_kdd_metrics.txt
│   ├── gradient_boosting_kdd_metrics.txt
│   └── voting_classifier_kdd_metrics.txt
│
├── Comparación
│   ├── models_comparison.txt      # Reporte detallado
│   └── models_comparison.csv      # Datos tabulares
│
└── comparison_plots/               # Visualizaciones
    ├── metrics_comparison.html/png
    ├── errors_comparison.html/png
    ├── confusion_matrices.html/png
    ├── performance_radar.html/png
    ├── time_comparison.html/png
    ├── ranking_table.html/png
    └── error_rates.html/png
```

---

## 🎯 Criterios de Selección del Mejor Modelo

### **Para Detección de Intrusiones, priorizar:**

1. **F1-Score alto**: Balance entre precision y recall
2. **Recall alto**: Minimizar ataques no detectados (FN)
3. **ROC-AUC cercano a 1**: Excelente discriminación
4. **Baja tasa de FN**: Crítico en seguridad
5. **Tiempo de predicción razonable**: Para detección en tiempo real

### **Trade-offs a considerar:**

- **Precision vs Recall**: 
  - Alta precision → Menos falsas alarmas (FP)
  - Alto recall → Menos ataques perdidos (FN)
  
- **Rendimiento vs Velocidad**:
  - Modelos complejos → Mejor rendimiento, más lentos
  - Modelos simples → Más rápidos, menor rendimiento

- **Interpretabilidad vs Accuracy**:
  - Random Forest → Más interpretable (feature importance)
  - Voting Classifier → Mejor rendimiento, menos interpretable

---

## 📊 Ejemplo de Resultados Esperados

### **Tabla Comparativa (Ejemplo)**

| Modelo | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Tiempo (s) |
|--------|----------|-----------|--------|----------|---------|------------|
| Random Forest | 0.9987 | 0.9987 | 0.9986 | 0.9986 | 0.9999 | 0.15 |
| Gradient Boosting | 0.9985 | 0.9984 | 0.9985 | 0.9984 | 0.9998 | 0.25 |
| Voting Classifier | 0.9988 | 0.9988 | 0.9987 | 0.9987 | 0.9999 | 0.45 |
| AdaBoost | 0.9980 | 0.9979 | 0.9981 | 0.9980 | 0.9997 | 0.20 |

### **Interpretación**:
- **Mejor F1-Score**: Voting Classifier (0.9987)
- **Más rápido**: Random Forest (0.15s)
- **Mejor balance**: Random Forest (alto rendimiento + velocidad)

---

## 🔍 Análisis de Resultados

### **Qué buscar en los resultados:**

1. **Diferencias mínimas en métricas**:
   - Si todos los modelos tienen >99% accuracy, el dataset es "fácil"
   - Enfocarse en diferencias en FP y FN

2. **Consistencia entre métricas**:
   - Accuracy, Precision, Recall y F1 deben ser coherentes
   - ROC-AUC debe ser el más alto

3. **Análisis de errores**:
   - ¿Qué tipo de errores comete cada modelo?
   - ¿Son consistentes los errores entre modelos?

4. **Tiempo de predicción**:
   - ¿Es viable para producción?
   - ¿Vale la pena el trade-off rendimiento/velocidad?

---

## 💡 Recomendaciones

### **Para Producción:**
1. **Si priorizas velocidad**: Random Forest
2. **Si priorizas rendimiento máximo**: Voting Classifier
3. **Si necesitas balance**: Gradient Boosting

### **Para Investigación:**
- Entrenar todos los modelos
- Analizar en qué casos cada modelo falla
- Crear ensemble personalizado con los mejores

### **Para Aprendizaje:**
- Comparar las diferencias en hiperparámetros
- Analizar feature importance de cada modelo
- Estudiar las matrices de confusión

---

## 🛠️ Personalización

### **Modificar hiperparámetros:**

Edita los archivos `train_*.py` y ajusta los rangos en `param_dist`:

```python
param_dist = {
    "n_estimators": randint(100, 300),  # Más árboles
    "max_depth": randint(15, 25),        # Más profundidad
    # ...
}
```

### **Agregar más modelos:**

Crea un nuevo script `train_nuevo_modelo.py` siguiendo la estructura:
1. Cargar datos
2. Definir modelo
3. Optimizar hiperparámetros
4. Evaluar y guardar

Luego actualiza `train_all_models.py` para incluirlo.

---

## 📚 Referencias

- **Random Forest**: Breiman, L. (2001). Random Forests. Machine Learning, 45(1), 5-32.
- **AdaBoost**: Freund, Y., & Schapire, R. E. (1997). A decision-theoretic generalization of on-line learning.
- **Gradient Boosting**: Friedman, J. H. (2001). Greedy function approximation: a gradient boosting machine.
- **Ensemble Methods**: Dietterich, T. G. (2000). Ensemble methods in machine learning.

---

## 🎓 Conclusiones

La comparación de múltiples modelos permite:
- ✅ Identificar el mejor modelo para el problema específico
- ✅ Entender trade-offs entre rendimiento y velocidad
- ✅ Validar que el rendimiento es consistente
- ✅ Tomar decisiones informadas para producción

**Próximo paso**: Analiza los resultados de tu comparación y selecciona el modelo más adecuado para tu caso de uso.

---

**Autor**: Sistema de Comparación de Modelos ML  
**Dataset**: KDD Cup 1999  
**Versión**: 1.0
