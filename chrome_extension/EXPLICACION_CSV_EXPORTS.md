# 📊 Explicación de los Archivos CSV Exportados

## 🎯 Problema Identificado

El modelo ML fue entrenado con el **dataset KDD** que tiene **119 features**, pero la extensión captura datos HTTP que tienen solo 8 campos básicos. Esto causaba un error al intentar usar el CSV exportado directamente con el modelo.

## ✅ Solución Implementada

Ahora la extensión exporta **3 archivos diferentes** cuando haces click en "Exportar Datos":

### 1. `traffic-export-[timestamp].json`
**Formato**: JSON  
**Propósito**: Datos completos para análisis general  
**Contenido**:
```json
{
  "traffic": [...],
  "stats": {...},
  "attacks": {...},
  "exportedAt": "2024-11-16T23:45:00.000Z"
}
```

**Uso**: 
- Análisis manual
- Debugging
- Visualización en herramientas externas

---

### 2. `traffic-data-[timestamp].csv`
**Formato**: CSV HTTP Raw  
**Propósito**: Datos HTTP originales sin procesar  
**Columnas** (8):
```csv
url,method,statusCode,timestamp,duration,requestSize,responseSize,domain
```

**Ejemplo**:
```csv
url,method,statusCode,timestamp,duration,requestSize,responseSize,domain
"https://google.com",GET,200,1700000000,150,256,1024,google.com
"https://github.com/login",POST,401,1700000001,200,512,128,github.com
```

**Uso**:
- Análisis de tráfico HTTP
- Debugging de requests
- Análisis de patrones de navegación
- **NO compatible con el modelo ML directamente**

---

### 3. `traffic-kdd-[timestamp].csv` ⭐ **NUEVO**
**Formato**: CSV KDD (119 features)  
**Propósito**: Datos convertidos para el modelo ML  
**Columnas** (119):
```csv
duration,src_bytes,dst_bytes,land,wrong_fragment,urgent,hot,num_failed_logins,logged_in,num_compromised,root_shell,su_attempted,num_root,num_file_creations,num_shells,num_access_files,num_outbound_cmds,is_host_login,is_guest_login,count,srv_count,serror_rate,srv_serror_rate,rerror_rate,srv_rerror_rate,same_srv_rate,diff_srv_rate,srv_diff_host_rate,dst_host_count,dst_host_srv_count,dst_host_same_srv_rate,dst_host_diff_srv_rate,dst_host_same_src_port_rate,dst_host_srv_diff_host_rate,dst_host_serror_rate,dst_host_srv_serror_rate,dst_host_rerror_rate,dst_host_srv_rerror_rate,difficulty,protocol_type_icmp,protocol_type_tcp,protocol_type_udp,service_IRC,service_X11,...,flag_OTH,flag_REJ,flag_RSTO,flag_RSTOS0,flag_RSTR,flag_S0,flag_S1,flag_S2,flag_S3,flag_SF,flag_SH
```

**Ejemplo**:
```csv
duration,src_bytes,dst_bytes,land,wrong_fragment,urgent,hot,num_failed_logins,logged_in,...
0.15,256,1024,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,0,0,150,25,...
0.20,512,128,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,255,1,...
```

**Uso**:
- ✅ **Compatible con el modelo ML**
- Predicciones offline
- Análisis con el modelo entrenado
- Re-entrenamiento del modelo

---

## 🔄 Proceso de Conversión HTTP → KDD

```
HTTP Request (8 campos)
    ↓
HTTPToKDDAdapter (Backend)
    ↓
119 Features KDD
    ↓
CSV Compatible con el Modelo
```

### Mapeo de Features

| HTTP Data | → | KDD Feature | Descripción |
|-----------|---|-------------|-------------|
| `duration` | → | `duration` | Tiempo de respuesta (ms→s) |
| `requestSize` | → | `src_bytes` | Bytes enviados |
| `responseSize` | → | `dst_bytes` | Bytes recibidos |
| `statusCode == 200` | → | `logged_in` | Login exitoso |
| `statusCode in [401, 403]` | → | `num_failed_logins` | Intentos fallidos |
| URL analysis | → | `service_*` | Tipo de servicio (http, auth, ftp, etc.) |
| Status code | → | `flag_*` | Estado de conexión (SF, REJ, S0, etc.) |
| HTTP | → | `protocol_type_tcp` | Siempre TCP para HTTP |
| Agregaciones | → | `count`, `srv_count`, etc. | Estadísticas de tráfico |

### Features Simuladas

Algunas features KDD no tienen equivalente en HTTP, por lo que se simulan con valores por defecto:

- `land`, `wrong_fragment`, `urgent` → 0
- `root_shell`, `su_attempted` → 0
- `num_compromised`, `num_shells` → 0
- `is_host_login`, `is_guest_login` → 0

---

## 🚀 Cómo Usar Cada Archivo

### Caso 1: Análisis General
**Archivo**: `traffic-export-[timestamp].json`
```bash
# Abrir con cualquier visor JSON
cat traffic-export-*.json | jq .
```

### Caso 2: Análisis de Tráfico HTTP
**Archivo**: `traffic-data-[timestamp].csv`
```python
import pandas as pd

# Leer CSV HTTP
df = pd.read_csv('traffic-data-*.csv')

# Análisis de dominios más visitados
print(df['domain'].value_counts())

# Análisis de status codes
print(df['statusCode'].value_counts())
```

### Caso 3: Predicción con el Modelo ML ⭐
**Archivo**: `traffic-kdd-[timestamp].csv`
```python
import pandas as pd
import joblib

# Cargar modelo
model = joblib.load('output/gradient_boosting_kdd_model.joblib')

# Leer CSV KDD
df = pd.read_csv('traffic-kdd-*.csv')

# Hacer predicciones
predictions = model.predict(df)
probabilities = model.predict_proba(df)

# Ver resultados
print(f"Ataques detectados: {sum(predictions == 1)}")
print(f"Tráfico normal: {sum(predictions == 0)}")
```

---

## 🔧 Endpoints del Backend

### 1. Predicción en Tiempo Real
```http
POST /api/predict-realtime
Content-Type: application/json

{
  "traffic": [
    {
      "url": "https://example.com",
      "method": "GET",
      "statusCode": 200,
      "timestamp": 1700000000,
      "duration": 150,
      "requestSize": 256,
      "responseSize": 1024,
      "domain": "example.com"
    }
  ]
}
```

**Respuesta**: Predicciones del modelo

### 2. Exportar Features KDD (NUEVO)
```http
POST /api/export-kdd-features
Content-Type: application/json

{
  "traffic": [...]
}
```

**Respuesta**: CSV con 119 features KDD

---

## ⚠️ Limitaciones

### CSV HTTP (`traffic-data-*.csv`)
- ❌ **NO compatible** con el modelo ML directamente
- ✅ Útil para análisis de tráfico HTTP
- ✅ Fácil de leer y entender

### CSV KDD (`traffic-kdd-*.csv`)
- ✅ **Compatible** con el modelo ML
- ⚠️ Mapeo HTTP→KDD no es perfecto
- ⚠️ Algunas features son aproximadas
- ⚠️ Precisión puede variar según el tipo de ataque

---

## 📝 Notas Importantes

1. **Siempre usa `traffic-kdd-*.csv` para predicciones ML**
2. El CSV HTTP es solo para análisis de tráfico web
3. El backend debe estar corriendo para generar el CSV KDD
4. Si el backend no está disponible, solo se exportarán los primeros 2 archivos

---

## 🎯 Resumen

| Archivo | Formato | Features | Uso Principal | Compatible con ML |
|---------|---------|----------|---------------|-------------------|
| `traffic-export-*.json` | JSON | Completo | Análisis general | ❌ |
| `traffic-data-*.csv` | CSV | 8 HTTP | Análisis HTTP | ❌ |
| `traffic-kdd-*.csv` | CSV | 119 KDD | Predicciones ML | ✅ |

**Recomendación**: Para usar el modelo ML, siempre usa `traffic-kdd-*.csv`

---

**Última actualización**: 2024-11-16  
**Versión**: 2.0.1
