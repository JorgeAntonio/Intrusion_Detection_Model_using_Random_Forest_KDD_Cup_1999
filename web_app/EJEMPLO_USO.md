# 📖 Ejemplo de Uso - Gradient Boosting Dashboard

## Escenario: Análisis de Tráfico de Red

### 1. Preparación

Antes de comenzar, asegúrate de tener:
- ✅ Modelo entrenado en `output/gradient_boosting_kdd_model.joblib`
- ✅ Backend ejecutándose en http://localhost:5000
- ✅ Frontend ejecutándose en http://localhost:3000

### 2. Cargar Datos

#### Opción A: Usar el Dataset de Entrenamiento
El archivo de entrenamiento completo está en:
```
scripts/KDD_TRAIN_FULL.csv
```

Este archivo incluye la columna `binario` con las etiquetas reales, por lo que verás:
- ✅ Predicciones del modelo
- ✅ Evaluación completa con métricas
- ✅ Matriz de confusión
- ✅ Curvas ROC y Precision-Recall

#### Opción B: Crear Datos de Prueba Personalizados

Si quieres probar con tus propios datos, el CSV debe tener el mismo formato:

```csv
feature_0,feature_1,feature_2,...,feature_40,binario
0.5,1.2,0.8,...,0.3,0
0.3,2.1,1.5,...,0.7,1
```

**Sin etiquetas** (solo predicciones):
```csv
feature_0,feature_1,feature_2,...,feature_40
0.5,1.2,0.8,...,0.3
0.3,2.1,1.5,...,0.7
```

### 3. Flujo de Trabajo Típico

#### Paso 1: Abrir la Aplicación
```
http://localhost:3000
```

#### Paso 2: Revisar Info del Modelo
- Click en "Info del Modelo"
- Verifica las métricas de entrenamiento:
  - Accuracy: 99.94%
  - ROC AUC: 99.99%
  - F1-Score: 99.93%
- Revisa los hiperparámetros optimizados

#### Paso 3: Cargar Archivo
- Click en "Cargar Datos"
- Arrastra tu archivo CSV o haz click para seleccionar
- Click en "Analizar Datos"
- Espera mientras el modelo procesa (puede tomar unos segundos)

#### Paso 4: Analizar Resultados
Automáticamente verás el dashboard con:

**Resumen General:**
- Total de muestras analizadas
- Cantidad de tráfico normal
- Cantidad de ataques detectados
- Precisión del modelo (si hay etiquetas)

**Visualizaciones:**
- 📊 Gráfico de pie: Distribución Normal vs Ataque
- 🎯 Matriz de confusión: Verdaderos positivos/negativos
- 📈 Curva ROC: Rendimiento del clasificador
- 📉 Curva Precision-Recall: Balance precision/recall
- 📋 Tabla de clasificación: Métricas detalladas

**Alertas:**
- 🟢 Verde: Nivel de amenazas bajo (<50% ataques)
- 🔴 Rojo: Alto nivel de amenazas (>50% ataques)

### 4. Interpretación de Resultados

#### Tráfico Normal (Clase 0)
```
Predicción: 0
Significado: Conexión de red legítima
Acción: Ninguna acción requerida
```

#### Ataque Detectado (Clase 1)
```
Predicción: 1
Significado: Posible intrusión o actividad maliciosa
Acción: Revisar logs, bloquear IP, investigar
```

#### Métricas Clave

**Accuracy (Precisión General)**
- Porcentaje de predicciones correctas
- Valor alto (>99%) = Modelo muy confiable

**ROC AUC**
- Capacidad de distinguir entre clases
- Valor cercano a 1.0 = Excelente discriminación

**Precision**
- De los clasificados como ataque, ¿cuántos son realmente ataques?
- Alta precision = Pocos falsos positivos

**Recall**
- De todos los ataques reales, ¿cuántos detectamos?
- Alto recall = Pocos falsos negativos

**F1-Score**
- Balance entre precision y recall
- Valor alto = Buen balance general

### 5. Casos de Uso Reales

#### Caso 1: Monitoreo de Red en Tiempo Real
```
Objetivo: Detectar intrusiones en tráfico de red
Archivo: Logs de conexiones de las últimas 24h
Resultado: Identificar IPs sospechosas para bloqueo
```

#### Caso 2: Análisis Forense
```
Objetivo: Investigar incidente de seguridad
Archivo: Logs históricos del periodo del incidente
Resultado: Identificar patrones de ataque y vectores
```

#### Caso 3: Evaluación de Seguridad
```
Objetivo: Auditoría de seguridad de la red
Archivo: Muestra representativa del tráfico
Resultado: Baseline de seguridad y áreas de mejora
```

### 6. Mejores Prácticas

✅ **DO:**
- Usar datos con el mismo formato que el entrenamiento
- Analizar muestras representativas del tráfico
- Revisar las alertas de alto riesgo inmediatamente
- Mantener logs de los análisis realizados

❌ **DON'T:**
- No usar datos con características diferentes
- No ignorar alertas de seguridad
- No analizar archivos demasiado grandes (>100MB) sin preprocesar
- No confiar ciegamente en las predicciones sin contexto

### 7. Troubleshooting

#### Error: "Modelo no encontrado"
```bash
# Entrenar el modelo primero
cd scripts
python train_gradient_boosting.py
```

#### Error: "Formato de archivo incorrecto"
- Verificar que sea CSV
- Verificar que tenga las columnas correctas
- Verificar que no tenga valores faltantes

#### Predicciones Inesperadas
- Verificar que los datos estén normalizados
- Verificar que las características sean numéricas
- Comparar con el dataset de entrenamiento

### 8. Próximos Pasos

1. **Integración Continua**: Conectar con sistemas de monitoreo
2. **Alertas Automáticas**: Configurar notificaciones por email/SMS
3. **Análisis Histórico**: Crear dashboard de tendencias temporales
4. **Reentrenamiento**: Actualizar modelo con nuevos datos

---

## 💡 Tips Avanzados

### Optimizar Rendimiento
- Procesar archivos en lotes de 10,000 registros
- Usar compresión para archivos grandes
- Cachear resultados frecuentes

### Personalización
- Ajustar umbrales de clasificación según tu caso de uso
- Modificar colores y estilos en TailwindCSS
- Agregar nuevas visualizaciones en Dashboard.js

### Seguridad
- Implementar autenticación de usuarios
- Encriptar datos sensibles
- Auditar accesos al modelo

---

¿Necesitas ayuda? Revisa el README.md principal o contacta al equipo de desarrollo.
