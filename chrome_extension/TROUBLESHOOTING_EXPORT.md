# 🔧 Solución de Problemas - Botón de Exportar

## Problema
El botón "Exportar Datos" en la extensión no está funcionando correctamente.

## ✅ Cambios Realizados

### 1. **popup-realtime.js**
- ✅ Agregado manejo de errores detallado
- ✅ Logs en consola para diagnóstico
- ✅ Validación de datos antes de exportar
- ✅ Mejor manejo de blobs y descargas
- ✅ Escapado de comillas en CSV

### 2. **background.js**
- ✅ Logs de diagnóstico en el handler
- ✅ Try-catch para capturar errores
- ✅ Validación de networkMonitor

## 🧪 Cómo Probar

### Paso 1: Recargar la Extensión
1. Abre Chrome y ve a `chrome://extensions/`
2. Busca tu extensión "Network Analyzer"
3. Click en el botón de **Recargar** (icono circular)

### Paso 2: Abrir la Consola del Popup
1. Click derecho en el icono de la extensión
2. Selecciona **"Inspeccionar popup"**
3. Se abrirá DevTools con la consola

### Paso 3: Abrir la Consola del Background
1. En `chrome://extensions/`
2. Busca tu extensión
3. Click en **"service worker"** (o "background page")
4. Se abrirá otra ventana de DevTools

### Paso 4: Generar Tráfico
1. Navega por algunos sitios web (ej: google.com, github.com)
2. Abre el popup de la extensión
3. Verifica que veas requests en "Tráfico Reciente"

### Paso 5: Probar Exportación
1. Con ambas consolas abiertas (popup y background)
2. Click en el botón **"Exportar Datos"**
3. Observa los logs en ambas consolas

## 📊 Logs Esperados

### En la Consola del Popup:
```
Exportando datos de tráfico...
Respuesta recibida: {traffic: Array(X), stats: {...}, attacks: {...}}
Exportando X requests
Exportando X requests como CSV
CSV exportado exitosamente
Exportación completada
```

### En la Consola del Background:
```
Background: Recibida solicitud de exportación
Background: Datos exportados: {trafficCount: X, hasStats: true, hasAttacks: true}
```

## ❌ Posibles Errores y Soluciones

### Error 1: "Monitor not initialized"
**Causa**: El NetworkMonitor no se ha inicializado
**Solución**:
1. Verifica que el monitoreo esté **ACTIVO** (toggle en ON)
2. Recarga la extensión
3. Navega por algunos sitios para generar tráfico

### Error 2: "No hay datos de tráfico para exportar"
**Causa**: No hay requests capturados
**Solución**:
1. Asegúrate de que el monitoreo esté activo
2. Navega por sitios web para generar tráfico
3. Espera unos segundos y vuelve a intentar

### Error 3: "chrome.runtime.lastError"
**Causa**: Error de comunicación entre popup y background
**Solución**:
1. Recarga la extensión completamente
2. Cierra y vuelve a abrir el popup
3. Verifica los permisos en manifest.json

### Error 4: No se descarga nada
**Causa**: Permisos de descarga bloqueados
**Solución**:
1. Verifica que Chrome tenga permisos de descarga
2. Revisa la configuración de descargas en Chrome
3. Intenta con otra ubicación de descarga

## 🔍 Diagnóstico Avanzado

### Verificar que exportTrafficData() funciona:
Abre la consola del background y ejecuta:
```javascript
// Verificar que networkMonitor existe
console.log('networkMonitor:', networkMonitor);

// Verificar que tiene datos
console.log('requestDetails:', networkMonitor?.requestDetails?.size);

// Probar exportación manual
const data = networkMonitor?.exportTrafficData();
console.log('Datos exportados:', data);
```

### Verificar estructura de datos:
```javascript
// En la consola del background
const data = networkMonitor.exportTrafficData();
console.log('Traffic count:', data.traffic.length);
console.log('First request:', data.traffic[0]);
console.log('Stats:', data.stats);
console.log('Attacks:', data.attacks);
```

## 🎯 Resultado Esperado

Al hacer click en "Exportar Datos", deberías ver:
1. ✅ **2 archivos descargados**:
   - `traffic-export-[timestamp].json` - Datos completos en JSON
   - `traffic-data-[timestamp].csv` - Datos para análisis ML

2. ✅ **Contenido del JSON**:
```json
{
  "traffic": [
    {
      "url": "https://example.com",
      "method": "GET",
      "statusCode": 200,
      "timestamp": 1234567890,
      "duration": 150,
      "requestSize": 256,
      "responseSize": 1024,
      "domain": "example.com"
    }
  ],
  "stats": {
    "totalRequests": 10,
    "blockedRequests": 0,
    "suspiciousActivity": 0,
    "mlPredictions": 0
  },
  "attacks": {
    "ddos": [],
    "bruteForce": [],
    "suspicious": [],
    "mlDetected": []
  },
  "exportedAt": "2024-11-16T23:45:00.000Z"
}
```

3. ✅ **Contenido del CSV**:
```csv
url,method,statusCode,timestamp,duration,requestSize,responseSize,domain
"https://example.com",GET,200,1234567890,150,256,1024,example.com
```

## 📝 Notas Importantes

1. **Permisos**: La extensión necesita permiso de `downloads` (ya incluido en manifest.json)
2. **Datos**: Solo se exportan los datos almacenados en `requestDetails` (Map)
3. **Límite**: Por defecto, se mantienen los últimos requests en memoria
4. **Formato**: JSON para análisis completo, CSV para ML

## 🆘 Si Nada Funciona

1. **Elimina y reinstala la extensión**:
   - Elimina la extensión de Chrome
   - Recarga la carpeta completa
   - Verifica que todos los archivos estén actualizados

2. **Verifica la versión de Chrome**:
   - Debe ser Chrome 88+ o compatible
   - Manifest V3 requiere versiones recientes

3. **Revisa los permisos**:
   - En `chrome://extensions/` verifica que la extensión tenga todos los permisos
   - Especialmente: `webRequest`, `storage`, `downloads`

4. **Contacta con soporte**:
   - Incluye los logs de ambas consolas
   - Captura de pantalla del error
   - Versión de Chrome

---

**Última actualización**: 2024-11-16
**Versión de la extensión**: 2.0.0
