# ⚡ Guía Rápida - Sistema de Detección de Intrusiones

## 🚀 Inicio Rápido (3 comandos)

```powershell
# 1. Preparar datos
python .\scripts\download_and_chunk.py

# 2. Entrenar todos los modelos y comparar
python .\scripts\train_all_models.py

# 3. Listo! Revisa los resultados en output/
```

---

## 📊 Modelos Disponibles

| Modelo | Script | Tiempo | Características |
|--------|--------|--------|-----------------|
| **Random Forest** | `train_random_forest.py` | 5-10 min | Rápido, robusto, interpretable |
| **AdaBoost** | `train_adaboost.py` | 10-15 min | Enfoque en casos difíciles |
| **Gradient Boosting** | `train_gradient_boosting.py` | 15-20 min | Alto rendimiento |
| **Voting Classifier** | `train_voting_classifier.py` | 20-30 min | Ensemble de 4 modelos |

---

## 📁 Archivos Generados

### Modelos (output/)
- `rf_kdd_model.joblib`
- `adaboost_kdd_model.joblib`
- `gradient_boosting_kdd_model.joblib`
- `voting_classifier_kdd_model.joblib`

### Métricas (output/)
- `*_kdd_metrics.txt` (4 archivos)
- `models_comparison.txt`
- `models_comparison.csv`

### Visualizaciones
- `output/plots/` - Gráficos individuales (6 por modelo)
- `output/comparison_plots/` - Comparaciones (7 gráficos)

---

## 🔍 Comandos Útiles

### Entrenar un solo modelo
```powershell
python .\scripts\train_random_forest.py
```

### Comparar modelos ya entrenados
```powershell
python .\scripts\compare_models.py
python .\scripts\visualize_comparison.py
```

### Generar visualizaciones individuales
```powershell
python .\scripts\generate_visualizations.py
```

---

## 📖 Documentación

- **README.md** - Documentación principal
- **README_TRAINING.md** - Detalles técnicos del entrenamiento
- **README_COMPARISON.md** - Guía de comparación de modelos
- **GUIA_RAPIDA.md** - Este archivo

---

## 🎯 Resultados Esperados

Todos los modelos logran:
- ✅ Accuracy > 99.8%
- ✅ ROC-AUC > 0.999
- ✅ F1-Score > 0.998
- ✅ Menos de 50 errores en 25,000 muestras

---

## ⚠️ Requisitos

- Python 3.8+
- 4-6 GB RAM
- 30-60 minutos para entrenamiento completo
- ~500 MB espacio en disco

---

## 🆘 Solución de Problemas

### Error: "CSV no encontrado"
```powershell
python .\scripts\download_and_chunk.py
```

### Error: "Modelo no encontrado"
```powershell
# Entrena el modelo primero
python .\scripts\train_random_forest.py
```

### Error de memoria
- Cierra otras aplicaciones
- Reduce `n_jobs` en los scripts (cambia de 2 a 1)

---

## 📞 Contacto

¿Preguntas? Revisa los README detallados o abre un issue en GitHub.

**¡Feliz entrenamiento! 🚀**
