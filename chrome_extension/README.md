# 🔌 Extensión de Chrome - Gradient Boosting Network Analyzer

Extensión de Chrome para **detectar intrusiones en tiempo real** usando un sistema híbrido que combina **reglas heurísticas** con **predicciones de Machine Learning** (Gradient Boosting).

## 🌟 Características

### 🔴 Detección en Tiempo Real
- 🤖 **Predicciones ML**: Analiza tráfico HTTP con el modelo Gradient Boosting
- ⚡ **Detección por Reglas**: Identifica DDoS, Brute Force y patrones sospechosos
- 📊 **Monitoreo Continuo**: Captura y analiza cada request HTTP
- 🎯 **Nivel de Amenaza**: Clasificación automática (low/medium/high)

### 📈 Análisis y Visualización
- ✅ **Análisis CSV**: Analiza archivos de tráfico offline
- 📊 **Dashboard Integrado**: Visualiza estadísticas en tiempo real
- 🔔 **Notificaciones Inteligentes**: Alertas con confianza ML
- 💾 **Exportación de Datos**: 3 formatos (JSON, CSV HTTP, CSV KDD)
- ⚡ **Acceso Rápido**: Popup con métricas en vivo

## 📦 Instalación

### Paso 1: Preparar la Extensión

Los archivos de la extensión están en:
```
chrome_extension/
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
├── background.js
├── icons/
└── README.md
```

### Paso 2: Crear Iconos

Necesitas crear los iconos en la carpeta `icons/`. Puedes:

**Opción A: Usar iconos existentes**
- Copia cualquier imagen PNG y renómbrala como:
  - `icon16.png` (16x16 px)
  - `icon48.png` (48x48 px)
  - `icon128.png` (128x128 px)

**Opción B: Crear iconos personalizados**
- Usa herramientas como [Canva](https://www.canva.com) o [Figma](https://www.figma.com)
- Diseña un icono con el tema de redes/seguridad
- Exporta en los tamaños requeridos

**Opción C: Usar generador online**
- Ve a [Icon Generator](https://www.favicon-generator.org/)
- Sube una imagen y genera los tamaños

### Paso 3: Instalar en Chrome

1. **Abrir Chrome Extensions**
   - Abre Chrome
   - Ve a `chrome://extensions/`
   - O menú → Más herramientas → Extensiones

2. **Activar Modo Desarrollador**
   - Activa el switch "Modo de desarrollador" (esquina superior derecha)

3. **Cargar Extensión**
   - Click en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta `chrome_extension`
   - La extensión aparecerá en tu barra de herramientas

4. **Anclar Extensión** (Opcional)
   - Click en el ícono de puzzle en la barra de Chrome
   - Click en el pin junto a "Network Analyzer"

## 🚀 Uso

### Inicio Rápido

1. **Asegúrate de que el backend esté ejecutándose**
   ```bash
   cd web_app/backend
   python app.py
   ```
   El servidor debe estar en `http://localhost:5000`

2. **Click en el ícono de la extensión**
   - Verás el popup con la información del modelo

3. **Cargar archivo CSV**
   - Click en "Seleccionar archivo CSV" o arrastra y suelta
   - El archivo debe tener el formato del dataset KDD

4. **Analizar**
   - Click en "Analizar"
   - Espera los resultados (puede tomar unos segundos)

5. **Ver Resultados**
   - Resumen de predicciones (Normal vs Ataques)
   - Métricas de evaluación (si hay etiquetas)
   - Alertas de seguridad

### Características Avanzadas

#### Abrir Dashboard Completo
- Click en "Abrir Dashboard Completo" en el footer
- Se abrirá la aplicación web React en una nueva pestaña

#### Ver Historial
- Los últimos 10 análisis se guardan automáticamente
- Accede desde el almacenamiento local de Chrome

#### Notificaciones
- Recibirás notificaciones automáticas si se detecta alto nivel de amenazas
- Puedes desactivarlas en la configuración

## 🎨 Interfaz

### Secciones del Popup

```
┌─────────────────────────────────┐
│ 🧠 Network Analyzer    ● Online │
├─────────────────────────────────┤
│ Información del Modelo          │
│ ┌─────────┬─────────┐          │
│ │  70     │   7     │          │
│ │Estimad. │Max Depth│          │
│ └─────────┴─────────┘          │
│ Accuracy: 99.94%                │
├─────────────────────────────────┤
│ Analizar Datos                  │
│ [📤 Seleccionar CSV]            │
│ [Analizar]                      │
├─────────────────────────────────┤
│ Resultados                      │
│ ✅ 13,460 Normal (53.4%)        │
│ ⚠️  11,735 Ataques (46.6%)      │
└─────────────────────────────────┘
```

## ⚙️ Configuración

### Cambiar URL del API

Edita `popup.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

### Permisos

La extensión requiere:
- `storage`: Para guardar historial y configuración
- `activeTab`: Para interactuar con la pestaña actual
- `http://localhost:5000/*`: Para conectarse al API

## 🐛 Solución de Problemas

### "API no disponible"
**Causa**: El backend no está ejecutándose  
**Solución**: 
```bash
cd web_app/backend
python app.py
```

### "Error de CORS"
**Causa**: El backend no permite peticiones desde la extensión  
**Solución**: Ya está configurado en `backend/app.py` con `flask-cors`

### La extensión no aparece
**Causa**: Error en manifest.json o archivos faltantes  
**Solución**: 
1. Verifica que todos los archivos existan
2. Revisa errores en `chrome://extensions/`
3. Recarga la extensión

### Iconos no se muestran
**Causa**: Archivos de iconos faltantes  
**Solución**: Crea los archivos PNG en la carpeta `icons/`

### Resultados no se muestran
**Causa**: Formato de archivo incorrecto  
**Solución**: Usa un CSV con el formato del dataset KDD

## 📊 Formato del Archivo CSV

El archivo debe tener:
- Mismas características que el dataset de entrenamiento
- Valores numéricos
- Opcionalmente, columna `binario` (0 o 1) para evaluación

Ejemplo:
```csv
feature_0,feature_1,feature_2,...,binario
0.5,1.2,0.8,...,0
0.3,2.1,1.5,...,1
```

## 🔐 Seguridad y Privacidad

- ✅ Los datos se procesan localmente en tu servidor
- ✅ No se envían datos a servidores externos
- ✅ El historial se guarda solo en tu navegador
- ✅ Puedes borrar el historial en cualquier momento

## 🧠 Sistema Híbrido ML + Reglas

### Arquitectura

```
Chrome Extension → Captura HTTP → Network Monitor
                                        ↓
                    [Detección por Reglas] (Inmediata)
                                        ↓
                    [Cada 10 requests] → Backend API
                                        ↓
                    HTTPToKDDAdapter → Convierte HTTP a KDD
                                        ↓
                    Gradient Boosting Model → Predice
                                        ↓
                    Extension ← Recibe predicciones ML
```

### Tipos de Detección

#### 1. Detección por Reglas (Inmediata)
- **DDoS**: > 5 requests/segundo al mismo dominio
- **Brute Force**: > 3 intentos fallidos (401/403) en 1 minuto
- **Patrones Sospechosos**: URLs con `/admin`, `/login`, `/.env`, etc.

#### 2. Detección por ML (Cada 10 requests)
- **Adaptador HTTP→KDD**: Convierte tráfico HTTP a 119 features KDD
- **Predicción**: Modelo clasifica cada request (normal/attack)
- **Confianza**: Probabilidad de la predicción (0-100%)
- **Nivel de Amenaza**: Basado en attack_probability

### Features Mapeadas

| HTTP Data | KDD Feature | Descripción |
|-----------|-------------|-------------|
| `duration` | `duration` | Tiempo de respuesta (ms→s) |
| `requestSize` | `src_bytes` | Bytes enviados |
| `responseSize` | `dst_bytes` | Bytes recibidos |
| `statusCode == 200` | `logged_in` | Login exitoso |
| `count(401, 403)` | `num_failed_logins` | Intentos fallidos |
| URL analysis | `service` | Tipo de servicio (http, auth, ftp) |
| Status code | `flag` | Estado de conexión (SF, REJ, S0) |

### Limitaciones

⚠️ **Importante**: El modelo fue entrenado con el dataset KDD (tráfico TCP/IP de red), pero la extensión captura tráfico HTTP del navegador. El adaptador hace el mejor mapeo posible, pero:

- Algunas features KDD no tienen equivalente en HTTP (se simulan)
- La precisión puede variar según el tipo de ataque
- Ataques DDoS y Brute Force tienen mejor detección
- No es detección en tiempo real estricto (batch de 10 requests)

## 🚀 Próximas Funcionalidades

- [ ] Bloqueo automático de requests maliciosos
- [ ] Modelo TensorFlow.js en el navegador (sin latencia)
- [ ] Reentrenamiento con datos HTTP reales
- [ ] Whitelist/Blacklist de dominios
- [ ] Análisis de múltiples archivos
- [ ] Exportar resultados a PDF
- [ ] Gráficos interactivos en el popup
- [ ] Comparación de análisis históricos
- [ ] Configuración de umbrales personalizados
- [ ] Modo oscuro

## 📝 Desarrollo

### Estructura de Archivos

```
chrome_extension/
├── manifest.json          # Configuración de la extensión
├── popup.html            # UI del popup
├── popup.js              # Lógica del popup
├── styles.css            # Estilos
├── background.js         # Service worker
├── icons/                # Iconos de la extensión
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Esta documentación
```

### Modificar la Extensión

1. Edita los archivos necesarios
2. Ve a `chrome://extensions/`
3. Click en el botón de recarga (🔄) de la extensión
4. Prueba los cambios

### Debug

1. Click derecho en el ícono de la extensión
2. Selecciona "Inspeccionar popup"
3. Se abrirá DevTools para el popup

Para el background script:
1. Ve a `chrome://extensions/`
2. Click en "service worker" bajo tu extensión
3. Se abrirá DevTools para el background

## 🤝 Contribuir

Para contribuir:
1. Crea una rama para tu feature
2. Realiza tus cambios
3. Prueba exhaustivamente
4. Envía un pull request

## 📄 Licencia

Este proyecto es parte del sistema de detección de intrusiones con Machine Learning.

## 🆘 Soporte

Si encuentras problemas:
1. Revisa esta documentación
2. Verifica que el backend esté ejecutándose
3. Revisa la consola de Chrome para errores
4. Reporta el issue con detalles específicos

## 📊 Exportación de Datos

La extensión exporta **3 archivos** al hacer click en "Exportar Datos":

### 1. `traffic-export-[timestamp].json`
- **Formato**: JSON completo
- **Uso**: Análisis general, debugging
- **Contenido**: Tráfico + estadísticas + ataques

### 2. `traffic-data-[timestamp].csv`
- **Formato**: CSV HTTP (8 columnas)
- **Uso**: Análisis de tráfico web
- **Columnas**: url, method, statusCode, timestamp, duration, requestSize, responseSize, domain
- ⚠️ **NO compatible** con el modelo ML

### 3. `traffic-kdd-[timestamp].csv` ⭐
- **Formato**: CSV KDD (119 features)
- **Uso**: Predicciones con el modelo ML
- **Columnas**: duration, src_bytes, dst_bytes, protocol_type_*, service_*, flag_*, etc.
- ✅ **Compatible** con el modelo ML

**Importante**: Para usar el modelo ML, siempre usa el archivo `traffic-kdd-*.csv`

Ver **[EXPLICACION_CSV_EXPORTS.md](EXPLICACION_CSV_EXPORTS.md)** para más detalles.

## 📚 Documentación Adicional

- **[INSTALACION.md](INSTALACION.md)**: Guía detallada de instalación
- **[GUIA_PRUEBAS.md](GUIA_PRUEBAS.md)**: Cómo probar la extensión
- **[MONITOREO_TIEMPO_REAL.md](MONITOREO_TIEMPO_REAL.md)**: Monitoreo en tiempo real
- **[EXPLICACION_CSV_EXPORTS.md](EXPLICACION_CSV_EXPORTS.md)**: Diferencia entre los CSVs exportados
- **[INDEX.md](INDEX.md)**: Índice completo de documentación

## 🎯 Valor Real del Sistema

### ✅ Lo que SÍ hace
- Detecta ataques HTTP reales (DDoS, Brute Force)
- Usa el modelo ML entrenado para predicciones
- Proporciona métricas de confianza
- Exporta datos para análisis offline
- Combina velocidad (reglas) con precisión (ML)

### ⚠️ Limitaciones Honestas
- Mapeo HTTP→KDD no es perfecto
- Algunas features son aproximadas
- Latencia de predicción (batch processing)
- Precisión variable según tipo de ataque

### 🎓 Aprendizajes
- Sistema híbrido es más robusto que solo reglas o solo ML
- Adaptación de dominios (KDD→HTTP) es posible pero imperfecta
- Exportación de datos permite mejora continua
- Base sólida para evolucionar el sistema

---

**Versión**: 2.0.0 (Sistema Híbrido ML)  
**Última actualización**: Noviembre 2024  
**Compatible con**: Chrome 88+, Edge 88+, Brave  
**Modelo**: Gradient Boosting (KDD Dataset)
