# 📝 Changelog - Sistema de Detección de Intrusiones

## [1.1.0] - 2025-10-21

### ✅ Corregido
- **AdaBoost**: Eliminado parámetro `algorithm='SAMME'` deprecado en scikit-learn 1.6
  - Afectaba: `train_adaboost.py` y `train_voting_classifier.py`
  - Ahora usa el algoritmo por defecto (SAMME.R) que es más eficiente
  - Elimina warnings de FutureWarning durante el entrenamiento

### 📚 Actualizado
- **README_COMPARISON.md**: Documentación actualizada para reflejar el cambio de algoritmo

---

## [1.0.0] - 2025-10-21

### 🎉 Lanzamiento Inicial

#### ✨ Características
- **4 Modelos de ML implementados**:
  - Random Forest
  - AdaBoost
  - Gradient Boosting Machine
  - Voting Classifier (Ensemble)

#### 📊 Scripts Creados
- `train_random_forest.py` - Entrenamiento de Random Forest
- `train_adaboost.py` - Entrenamiento de AdaBoost
- `train_gradient_boosting.py` - Entrenamiento de GBM
- `train_voting_classifier.py` - Entrenamiento de Voting Classifier
- `train_all_models.py` - Script maestro para entrenar todos
- `compare_models.py` - Comparación de métricas
- `visualize_comparison.py` - Visualizaciones comparativas
- `generate_visualizations.py` - Visualizaciones individuales
- `download_and_chunk.py` - Preparación de datos

#### 📈 Visualizaciones
- 6 gráficos individuales por modelo
- 7 gráficos comparativos entre modelos
- Formatos: HTML (interactivo) y PNG (estático)

#### 📚 Documentación
- `README.md` - Documentación principal
- `README_TRAINING.md` - Guía técnica de entrenamiento
- `README_COMPARISON.md` - Guía de comparación de modelos
- `GUIA_RAPIDA.md` - Inicio rápido en 3 comandos

#### 🎯 Resultados
- Accuracy > 99.8% en todos los modelos
- ROC-AUC > 0.999 en todos los modelos
- Dataset: KDD Cup 1999 (~126,000 muestras)

---

## Notas de Compatibilidad

### Versiones de Dependencias
- Python: 3.8+
- scikit-learn: 1.6+ (recomendado para evitar warnings)
- pandas: 1.3+
- numpy: 1.20+
- plotly: 5.0+
- kaleido: 0.2+ (para exportar PNG)

### Cambios de API
- **scikit-learn 1.6**: Parámetro `algorithm` en AdaBoost deprecado
  - Antes: `AdaBoostClassifier(algorithm='SAMME')`
  - Ahora: `AdaBoostClassifier()` (usa SAMME.R por defecto)
