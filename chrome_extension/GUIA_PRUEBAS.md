# 🧪 Guía de Pruebas - Simulación de Ataques

## 🎯 Objetivo

Esta guía te ayudará a probar la extensión de Chrome simulando ataques reales contra tu servidor local.

---

## 📋 Requisitos Previos

### 1. Servidor Web Ejecutándose
```bash
# Opción 1: Aplicación React
cd web_app/frontend
npm start
# Debería estar en http://localhost:3000

# Opción 2: Cualquier servidor web local
# Solo necesitas que algo esté corriendo en localhost:3000
```

### 2. Extensión de Chrome Instalada
```
1. Abre chrome://extensions/
2. Activa "Modo de desarrollador"
3. Carga la extensión desde chrome_extension/
4. Verifica que esté activa
```

### 3. Python con requests
```bash
pip install requests
```

---

## 🚀 Cómo Ejecutar las Pruebas

### Paso 1: Preparar el Entorno

1. **Inicia tu servidor web**:
   ```bash
   cd web_app/frontend
   npm start
   ```
   Verifica que esté en http://localhost:3000

2. **Abre Chrome con la extensión**:
   - Abre una pestaña en http://localhost:3000
   - Click en el ícono de la extensión
   - **IMPORTANTE**: Mantén el popup abierto

3. **Abre el DevTools del Service Worker**:
   - Ve a `chrome://extensions/`
   - Encuentra tu extensión
   - Click en "service worker"
   - Verás la consola del background

### Paso 2: Ejecutar el Script de Pruebas

```bash
cd chrome_extension
python test_attacks.py
```

### Paso 3: Seleccionar Tipo de Ataque

El script mostrará un menú:

```
Selecciona el tipo de ataque a simular:
1. DDoS (Distributed Denial of Service)
2. Brute Force (Fuerza Bruta)
3. Suspicious Patterns (Patrones Sospechosos)
4. Mixed Attack (Ataque Mixto)
5. Ataque Personalizado
0. Salir
```

---

## 🎭 Tipos de Ataques Simulados

### 1. DDoS (Opción 1)

**Qué hace**:
- Envía 200 peticiones en 10 segundos (20 req/seg)
- Todas al mismo dominio (localhost:3000)

**Qué deberías ver en la extensión**:
- ✅ Notificación: "⚠️ DDoS Detectado"
- ✅ Badge en el ícono con "!"
- ✅ En el popup: Ataque DDoS listado
- ✅ Contador de peticiones aumentando rápidamente

**Configuración por defecto**:
```python
Duration: 10 segundos
Requests/second: 20
Total: 200 peticiones
```

**Ejemplo de salida**:
```
[1] Iniciando simulación de ataque DDoS...
    Duración: 10 segundos
    Peticiones/segundo: 20
    Total de peticiones: 200
    
    Enviando peticiones...
    [200] Status: 200
    
    ✓ Ataque DDoS completado!
    Total de peticiones: 200
    Exitosas: 200
    Errores: 0
    
    🔍 Verifica la extensión - Deberías ver una alerta de DDoS!
```

---

### 2. Brute Force (Opción 2)

**Qué hace**:
- Intenta 15 logins fallidos
- En endpoints como `/api/login`, `/api/auth`
- Con credenciales falsas

**Qué deberías ver en la extensión**:
- ✅ Notificación: "⚠️ Brute Force Detectado"
- ✅ En el popup: Ataque de Brute Force listado
- ✅ Contador de intentos fallidos

**Configuración por defecto**:
```python
Attempts: 15
Delay: 0.5 segundos entre intentos
```

**Ejemplo de salida**:
```
[2] Iniciando simulación de ataque de Fuerza Bruta...
    Intentos: 15
    Delay: 0.5s entre intentos
    
    Intentando autenticación...
    [1/15] http://localhost:3000/api/login - Endpoint no existe
    [2/15] http://localhost:3000/api/auth - Endpoint no existe
    ...
    
    ✓ Ataque de Fuerza Bruta completado!
    Total de intentos: 15
    Fallidos (401/403): 15
```

---

### 3. Suspicious Patterns (Opción 3)

**Qué hace**:
- Accede a 10 rutas sospechosas:
  - `/admin`
  - `/wp-admin`
  - `/.env`
  - `/.git`
  - etc.

**Qué deberías ver en la extensión**:
- ✅ En el popup: Actividad sospechosa detectada
- ✅ Contador de "Actividad Sospechosa" aumenta

**Rutas probadas**:
```
/admin
/wp-admin
/phpmyadmin
/.env
/.git
/config.php
/admin/login
/administrator
/admin/config
/backup.sql
```

**Ejemplo de salida**:
```
[3] Iniciando simulación de patrones sospechosos...
    Accediendo a 10 rutas sospechosas...
    [1/10] /admin - Status: 404
    [2/10] /wp-admin - Status: 404
    ...
    
    ✓ Patrones sospechosos completados!
```

---

### 4. Mixed Attack (Opción 4)

**Qué hace**:
Combina los 3 tipos de ataques en secuencia:
1. DDoS rápido (5 segundos, 30 req/seg)
2. Escaneo de rutas sospechosas
3. Brute Force (12 intentos)

**Qué deberías ver en la extensión**:
- ✅ Múltiples notificaciones
- ✅ Badge con contador de ataques
- ✅ Todos los tipos de ataques listados
- ✅ Actividad intensa en el tráfico reciente

**Ejemplo de salida**:
```
[4] Iniciando simulación de ATAQUE MIXTO...
    
    Fase 1: DDoS rápido (5 segundos)...
    [150] Status: 200
    ✓ Ataque DDoS completado!
    
    Fase 2: Escaneo de rutas sospechosas...
    [10/10] /backup.sql - Status: 404
    ✓ Patrones sospechosos completados!
    
    Fase 3: Intentos de Brute Force...
    [12/12] http://localhost:3000/signin - Endpoint no existe
    ✓ Ataque de Fuerza Bruta completado!
```

---

### 5. Ataque Personalizado (Opción 5)

**Qué hace**:
Te permite configurar:
- Tipo de ataque (DDoS o Brute Force)
- Duración / Número de intentos
- Peticiones por segundo / Delay

**Ejemplo**:
```
Tipo de ataque:
1. DDoS
2. Brute Force
Selecciona (1 o 2): 1

Duración (segundos): 15
Peticiones por segundo: 50

[Ejecuta DDoS con 750 peticiones totales]
```

---

## 📊 Qué Observar en la Extensión

### En el Popup

#### Estadísticas en Tiempo Real
```
┌─────────────────────────────────┐
│ Monitoreo en Tiempo Real        │
│ ┌──────────┬──────────┐        │
│ │   200    │    15    │        │ ← Deberías ver estos números
│ │Peticiones│Sospechosa│        │   aumentar durante el ataque
│ └──────────┴──────────┘        │
└─────────────────────────────────┘
```

#### Ataques Detectados
```
┌─────────────────────────────────┐
│ Ataques Detectados              │
│                                 │
│ ⚠️ DDoS                  HIGH   │ ← Aparece durante DDoS
│ localhost:3000                  │
│ 150 peticiones • Ahora          │
│                                 │
│ 🔒 Brute Force         MEDIUM   │ ← Aparece durante Brute Force
│ /api/login                      │
│ 12 intentos • 1m                │
└─────────────────────────────────┘
```

#### Tráfico Reciente
```
┌─────────────────────────────────┐
│ Tráfico Reciente    200 peticiones│
│                                 │
│ GET  localhost:3000    Ahora    │ ← Verás muchas peticiones
│ POST /api/login        2s       │   durante los ataques
│ GET  /admin            5s       │
└─────────────────────────────────┘
```

### En las Notificaciones de Chrome

Deberías recibir notificaciones como:

```
⚠️ DDoS Detectado
Target: localhost:3000
Severity: high
```

```
⚠️ Brute Force Detectado
Target: http://localhost:3000/api/login
Severity: medium
```

### En el Badge del Ícono

El ícono de la extensión debería mostrar:
- **"!"** o **número** cuando hay ataques activos
- **Fondo negro** (#000)

---

## 🔍 Debug y Verificación

### Consola del Service Worker

Abre `chrome://extensions/` → Click en "service worker"

Deberías ver logs como:
```javascript
Network Monitor started
Checking DDoS for: http://localhost:3000
DDoS detected: {type: "DDoS", target: "localhost:3000", ...}
Brute Force detected: {type: "Brute Force", ...}
```

### Consola del Popup

Click derecho en el popup → "Inspeccionar"

Deberías ver:
```javascript
Stats received: {totalRequests: 200, suspiciousActivity: 15, ...}
Attacks received: {ddos: [...], bruteForce: [...], ...}
```

---

## 🎯 Escenarios de Prueba Recomendados

### Prueba 1: DDoS Básico
```
1. Abre el popup de la extensión
2. Ejecuta: python test_attacks.py
3. Selecciona opción 1 (DDoS)
4. Observa:
   - Notificación de Chrome
   - Badge en el ícono
   - Ataque listado en el popup
   - Contador de peticiones aumentando
```

### Prueba 2: Brute Force
```
1. Abre el popup
2. Ejecuta opción 2 (Brute Force)
3. Observa:
   - Intentos fallidos en el tráfico
   - Notificación después de 10+ intentos
   - Ataque listado con contador
```

### Prueba 3: Ataque Mixto
```
1. Abre el popup
2. Ejecuta opción 4 (Mixed Attack)
3. Observa:
   - Múltiples tipos de ataques
   - Varias notificaciones
   - Badge con contador
   - Actividad intensa
```

### Prueba 4: Exportar Datos
```
1. Después de un ataque
2. Click en "Exportar Datos" en el popup
3. Verifica el JSON descargado
4. Debería contener todos los ataques detectados
```

---

## ⚙️ Ajustar Sensibilidad

Si no se detectan ataques o hay demasiadas detecciones:

### Reducir Umbral (Más Sensible)

Edita `network-monitor.js`:
```javascript
this.config = {
  ddosThreshold: 10,        // Reducir de 100 a 10
  bruteForceThreshold: 3,   // Reducir de 10 a 3
  // ...
};
```

Luego recarga la extensión en `chrome://extensions/`

### Aumentar Umbral (Menos Sensible)

```javascript
this.config = {
  ddosThreshold: 200,       // Aumentar a 200
  bruteForceThreshold: 20,  // Aumentar a 20
  // ...
};
```

---

## 🐛 Problemas Comunes

### No se detectan ataques

**Solución**:
1. Verifica que el monitoreo esté activo (toggle en el popup)
2. Abre la consola del service worker y busca errores
3. Reduce los umbrales temporalmente
4. Verifica que el servidor esté en localhost:3000

### Demasiadas notificaciones

**Solución**:
1. Aumenta los umbrales
2. Desactiva notificaciones:
   ```javascript
   chrome.storage.local.set({ notifications: false });
   ```

### El script Python falla

**Solución**:
1. Verifica que el servidor esté corriendo
2. Instala requests: `pip install requests`
3. Verifica la URL en `test_attacks.py`

---

## 📝 Checklist de Pruebas

Antes de dar por probada la extensión:

- [ ] DDoS detectado correctamente
- [ ] Brute Force detectado correctamente
- [ ] Patrones sospechosos detectados
- [ ] Notificaciones funcionan
- [ ] Badge se actualiza
- [ ] Popup muestra ataques en tiempo real
- [ ] Tráfico reciente se actualiza
- [ ] Exportar datos funciona
- [ ] Limpiar ataques funciona
- [ ] Toggle de monitoreo funciona

---

## 🎉 Resultados Esperados

Después de ejecutar todas las pruebas, deberías tener:

✅ **Notificaciones recibidas** para DDoS y Brute Force  
✅ **Badge activo** con contador de ataques  
✅ **Popup mostrando** todos los ataques detectados  
✅ **Tráfico en tiempo real** visible  
✅ **Datos exportables** en formato JSON  
✅ **Consola sin errores** en service worker y popup  

---

## 📚 Recursos Adicionales

- [MONITOREO_TIEMPO_REAL.md](MONITOREO_TIEMPO_REAL.md) - Documentación completa
- [ERRORES_COMUNES.md](ERRORES_COMUNES.md) - Solución de problemas
- [README.md](README.md) - Documentación general

---

**¡Listo para probar! Ejecuta `python test_attacks.py` y observa la magia de la detección en tiempo real.** 🚀
