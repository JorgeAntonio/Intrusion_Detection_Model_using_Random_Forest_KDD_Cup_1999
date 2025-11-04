# 🔴 Monitoreo en Tiempo Real - Extensión de Chrome

## 🎯 Nueva Funcionalidad v2.0

La extensión ahora **monitorea el tráfico de red en tiempo real** y detecta automáticamente ataques sin necesidad de subir archivos CSV.

---

## 🌟 Características

### ✅ Detección Automática de Ataques

#### 1. **DDoS (Distributed Denial of Service)**
- Detecta múltiples peticiones al mismo dominio en corto tiempo
- **Umbral**: 100 peticiones por segundo (configurable)
- **Severidad**: Alta
- **Notificación**: Automática

#### 2. **Fuerza Bruta (Brute Force)**
- Detecta múltiples intentos fallidos de autenticación
- Monitorea endpoints de login/auth
- **Umbral**: 10 intentos fallidos en 1 minuto
- **Severidad**: Media/Alta
- **Notificación**: Automática

#### 3. **Patrones Sospechosos**
- Detecta accesos a rutas sensibles:
  - `/admin`, `/login`, `/password`
  - `.env`, `.git`
  - `wp-admin`, `phpmyadmin`
- **Severidad**: Baja
- **Notificación**: Solo en log

---

## 🚀 Cómo Usar

### Instalación

1. **Cargar la extensión** (ver [INSTALACION.md](INSTALACION.md))
2. **Generar iconos**:
   ```bash
   python create_icons.py
   ```
3. **Cargar en Chrome**: `chrome://extensions/`

### Uso Diario

1. **Abrir la extensión**
   - Click en el ícono de la barra de herramientas
   - Se abre el popup de monitoreo en tiempo real

2. **Monitoreo automático**
   - La extensión comienza a monitorear automáticamente
   - No necesitas hacer nada más
   - El monitoreo es pasivo y no afecta el rendimiento

3. **Ver estadísticas**
   - **Peticiones Totales**: Contador de todas las peticiones
   - **Actividad Sospechosa**: Contador de eventos sospechosos
   - **Ataques Detectados**: Lista de ataques en tiempo real

4. **Recibir notificaciones**
   - Notificaciones automáticas para ataques DDoS y Fuerza Bruta
   - Badge en el ícono con contador de ataques activos

---

## 📊 Interfaz en Tiempo Real

### Secciones del Popup

```
┌─────────────────────────────────────┐
│ 🧠 Network Analyzer    [●] Activo  │
├─────────────────────────────────────┤
│ Monitoreo en Tiempo Real            │
│ ┌──────────┬──────────┐            │
│ │ 1,234    │    5     │            │
│ │Peticiones│Sospechosa│            │
│ └──────────┴──────────┘            │
├─────────────────────────────────────┤
│ Ataques Detectados                  │
│ ⚠️ DDoS - example.com               │
│    100 peticiones • HIGH            │
│ 🔒 Brute Force - /login             │
│    12 intentos • MEDIUM             │
├─────────────────────────────────────┤
│ Tráfico Reciente                    │
│ GET  example.com        Ahora       │
│ POST api.example.com    5s          │
│ GET  cdn.example.com    10s         │
├─────────────────────────────────────┤
│ [Dashboard] [Exportar]              │
└─────────────────────────────────────┘
```

### Elementos de la Interfaz

#### Toggle de Monitoreo
- **Activo/Inactivo**: Control del monitoreo
- **Ubicación**: Header superior derecho
- **Función**: Pausar/reanudar monitoreo

#### Estadísticas en Tiempo Real
- **Peticiones Totales**: Todas las peticiones monitoreadas
- **Actividad Sospechosa**: Eventos que requieren atención

#### Lista de Ataques
- **Tipo**: DDoS, Brute Force, Suspicious
- **Target**: URL o dominio afectado
- **Severidad**: HIGH, MEDIUM, LOW
- **Timestamp**: Cuándo ocurrió
- **Detalles**: Contador de peticiones/intentos

#### Tráfico Reciente
- **Método HTTP**: GET, POST, PUT, DELETE
- **Dominio**: Dominio de la petición
- **Tiempo**: Hace cuánto ocurrió

#### Acciones Rápidas
- **Dashboard Completo**: Abre la app web React
- **Exportar Datos**: Descarga JSON con análisis

---

## ⚙️ Configuración

### Umbrales de Detección

Edita `network-monitor.js`:

```javascript
this.config = {
  ddosThreshold: 100,        // Peticiones por segundo para DDoS
  ddosTimeWindow: 1000,      // Ventana de tiempo (ms)
  bruteForceThreshold: 10,   // Intentos fallidos para Brute Force
  bruteForceTimeWindow: 60000, // Ventana de tiempo (ms)
  suspiciousPatterns: [      // Patrones a detectar
    /admin/i,
    /login/i,
    /password/i,
    /\.env/i,
    /\.git/i
  ]
};
```

### Notificaciones

Habilitar/deshabilitar en `chrome.storage`:

```javascript
chrome.storage.local.set({
  notifications: true  // false para desactivar
});
```

---

## 🔔 Notificaciones

### Tipos de Notificaciones

#### DDoS Detectado
```
⚠️ DDoS Detectado
Target: example.com
Severity: high
```

#### Brute Force Detectado
```
⚠️ Brute Force Detectado
Target: https://example.com/login
Severity: medium
```

### Badge en el Ícono

- **Sin ataques**: Sin badge
- **Con ataques**: Número de ataques activos
- **Color**: Negro (#000)

---

## 📈 Análisis de Tráfico

### Análisis Periódico

La extensión analiza el tráfico cada **1 minuto** y guarda:

- Total de peticiones
- Peticiones por minuto
- Dominios únicos
- Ataques DDoS detectados
- Ataques de Fuerza Bruta
- Patrones sospechosos

### Almacenamiento

Los datos se guardan en `chrome.storage.local`:

```javascript
{
  networkAnalysis: {
    totalRequests: 1234,
    requestsPerMinute: 246.8,
    uniqueDomains: 45,
    ddosAttacks: 2,
    bruteForceAttacks: 1,
    suspiciousPatterns: 5
  },
  lastAnalysis: 1699123456789
}
```

---

## 🛡️ Seguridad y Privacidad

### ¿Qué se Monitorea?

- **URL**: Dirección de la petición
- **Método**: GET, POST, PUT, DELETE, etc.
- **Tipo**: Document, Script, XHR, etc.
- **Timestamp**: Cuándo ocurrió
- **Código de estado**: 200, 401, 403, etc.

### ¿Qué NO se Monitorea?

- ❌ Contenido de las peticiones
- ❌ Datos personales
- ❌ Contraseñas o tokens
- ❌ Cookies
- ❌ Headers sensibles

### Almacenamiento Local

- Todos los datos se guardan **localmente** en tu navegador
- No se envían a servidores externos
- Puedes limpiar los datos en cualquier momento
- Historial limitado a las últimas 1000 peticiones

---

## 🎯 Casos de Uso

### 1. Desarrollador Web
**Escenario**: Monitorear tu aplicación en desarrollo

```
1. Abrir extensión
2. Navegar por tu aplicación
3. Ver peticiones en tiempo real
4. Detectar problemas de rendimiento
5. Identificar peticiones sospechosas
```

### 2. Analista de Seguridad
**Escenario**: Detectar ataques en tiempo real

```
1. Activar monitoreo
2. Navegar por sitios web
3. Recibir alertas de ataques
4. Analizar patrones de tráfico
5. Exportar datos para análisis
```

### 3. Usuario Final
**Escenario**: Protección mientras navegas

```
1. Extensión activa en segundo plano
2. Notificaciones automáticas de amenazas
3. Ver qué sitios hacen muchas peticiones
4. Identificar sitios sospechosos
```

---

## 📊 Exportar Datos

### Formato JSON

Click en "Exportar Datos" para descargar:

```json
{
  "timestamp": "2024-11-04T14:30:00.000Z",
  "stats": {
    "totalRequests": 1234,
    "suspiciousActivity": 5,
    "attacks": {
      "ddos": 2,
      "bruteForce": 1,
      "suspicious": 5
    }
  },
  "attacks": {
    "ddos": [
      {
        "type": "DDoS",
        "target": "example.com",
        "requestCount": 150,
        "timestamp": 1699123456789,
        "severity": "high"
      }
    ],
    "bruteForce": [...],
    "suspicious": [...]
  }
}
```

### Uso del JSON

- Importar en herramientas de análisis
- Generar reportes
- Análisis histórico
- Integración con SIEM

---

## 🐛 Solución de Problemas

### No se detectan ataques

**Causa**: Umbral muy alto  
**Solución**: Reducir `ddosThreshold` o `bruteForceThreshold`

### Demasiadas notificaciones

**Causa**: Umbral muy bajo  
**Solución**: Aumentar umbrales o desactivar notificaciones

### Extensión consume mucha memoria

**Causa**: Muchas peticiones guardadas  
**Solución**: Click en "Limpiar" para borrar historial

### No aparece tráfico

**Causa**: Monitoreo desactivado  
**Solución**: Activar toggle en el header

---

## 🔄 Comparación: Archivo CSV vs Tiempo Real

| Característica | Archivo CSV | Tiempo Real |
|----------------|-------------|-------------|
| **Entrada** | Subir archivo manualmente | Automático |
| **Análisis** | Bajo demanda | Continuo |
| **Detección** | Retrospectiva | Inmediata |
| **Notificaciones** | No | Sí |
| **Uso** | Análisis forense | Monitoreo activo |
| **Datos** | Históricos | En vivo |

---

## 🚀 Próximas Funcionalidades

### Versión 2.1
- [ ] Gráficos de tráfico en tiempo real
- [ ] Filtros personalizables
- [ ] Exportar a CSV
- [ ] Comparación con baseline

### Versión 2.2
- [ ] Machine Learning en tiempo real
- [ ] Detección de Port Scanning
- [ ] Análisis de payloads
- [ ] Integración con APIs de threat intelligence

### Versión 3.0
- [ ] Dashboard embebido en la extensión
- [ ] Análisis de tendencias
- [ ] Alertas personalizadas
- [ ] Modo oscuro

---

## 📝 Notas Importantes

⚠️ **Permisos Requeridos**:
- `webRequest`: Para monitorear peticiones de red
- `<all_urls>`: Para monitorear todos los sitios
- `notifications`: Para alertas
- `alarms`: Para análisis periódico

⚠️ **Rendimiento**:
- El monitoreo es pasivo y no afecta la velocidad de navegación
- Mantiene solo las últimas 1000 peticiones en memoria
- Análisis periódico cada 1 minuto

⚠️ **Privacidad**:
- Todos los datos se guardan localmente
- No se envía información a servidores externos
- Puedes desactivar el monitoreo en cualquier momento

---

## 🎉 ¡Empieza a Monitorear!

1. **Carga la extensión** en Chrome
2. **Click en el ícono** para abrir el popup
3. **Navega normalmente** por internet
4. **Recibe alertas** automáticas de ataques

**¡La extensión ahora trabaja para ti en segundo plano!** 🛡️

---

**Versión**: 2.0.0  
**Última actualización**: Noviembre 2024  
**Documentación**: [README.md](README.md) | [INSTALACION.md](INSTALACION.md)
