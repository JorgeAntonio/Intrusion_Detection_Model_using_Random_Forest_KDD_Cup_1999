# 🔍 Diagnóstico Rápido - La Extensión No Detecta Ataques

## ✅ Pasos para Diagnosticar

### 1. Recarga la Extensión

**IMPORTANTE**: Después de cualquier cambio en el código, debes recargar:

```
1. Abre chrome://extensions/
2. Busca "Gradient Boosting Network Analyzer"
3. Click en el botón de RECARGA (🔄)
4. Espera a que diga "service worker (activo)"
```

### 2. Abre la Consola del Service Worker

```
1. En chrome://extensions/
2. Busca tu extensión
3. Click en "service worker" (link azul)
4. Se abre DevTools
```

**Busca estos mensajes**:

✅ **Si todo está bien, verás**:
```
🔧 Initializing Network Monitor...
✅ chrome.webRequest is available
✅ onBeforeRequest listener added
✅ onCompleted listener added
✅ onErrorOccurred listener added
✅ Network Monitor initialized successfully!
Network Monitor started
Background service worker initialized
```

❌ **Si hay problemas, verás**:
```
❌ chrome.webRequest is not available!
   Check manifest.json permissions
```

O:
```
Error: importScripts failed for network-monitor.js
```

### 3. Prueba con una Petición Manual

Abre una nueva pestaña y ve a `http://localhost:3000`

**En la consola del service worker deberías ver**:
```
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/static/css/main.css
📡 Request detected: http://localhost:3000/static/js/main.js
...
```

❌ **Si NO ves estos mensajes**: La extensión NO está monitoreando

### 4. Ejecuta el Ataque de Nuevo

```bash
python test_attacks.py
# Selecciona opción 1 (DDoS)
```

**En la consola del service worker deberías ver**:
```
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/
... (muchas veces)
DDoS detected: {type: "DDoS", target: "localhost:3000", ...}
```

---

## 🔧 Soluciones Comunes

### Problema 1: "chrome.webRequest is not available"

**Causa**: Falta permiso en manifest.json

**Solución**: Verifica que `manifest.json` tenga:
```json
{
  "permissions": [
    "webRequest"  // ← Debe estar aquí
  ],
  "host_permissions": [
    "<all_urls>"  // ← Debe estar aquí
  ]
}
```

### Problema 2: No se ven logs de "Request detected"

**Causa**: El listener no se agregó correctamente

**Solución**:
1. Recarga la extensión
2. Verifica la consola del service worker
3. Busca errores

### Problema 3: Se ven requests pero no se detectan ataques

**Causa**: Umbrales muy altos

**Solución**: Ya los reduje a:
- DDoS: 5 peticiones/segundo (antes 100)
- Brute Force: 3 intentos (antes 10)

Recarga la extensión y prueba de nuevo.

### Problema 4: "importScripts failed"

**Causa**: El archivo `network-monitor.js` no se encuentra

**Solución**: Verifica que exista:
```
chrome_extension/
├── background.js
├── network-monitor.js  ← Debe existir
├── manifest.json
...
```

---

## 🎯 Prueba Rápida

### Paso a Paso:

1. **Recarga la extensión**:
   ```
   chrome://extensions/ → 🔄 Recargar
   ```

2. **Abre consola del service worker**:
   ```
   chrome://extensions/ → "service worker"
   ```

3. **Verifica logs de inicialización**:
   ```
   Deberías ver: ✅ Network Monitor initialized successfully!
   ```

4. **Abre localhost:3000 en una pestaña**:
   ```
   Deberías ver: 📡 Request detected: http://localhost:3000/
   ```

5. **Ejecuta el ataque**:
   ```bash
   python test_attacks.py
   Opción: 1
   ```

6. **Verifica detección**:
   ```
   Deberías ver: DDoS detected: {...}
   Y recibir notificación de Chrome
   ```

---

## 📊 Checklist de Verificación

Marca cada item:

- [ ] Extensión recargada en chrome://extensions/
- [ ] Service worker activo (no "inactivo")
- [ ] Consola del service worker abierta
- [ ] Logs de inicialización correctos (✅)
- [ ] Se ven logs de "Request detected" al navegar
- [ ] Umbrales reducidos (5 para DDoS, 3 para Brute Force)
- [ ] Servidor corriendo en localhost:3000
- [ ] Popup de la extensión abierto

---

## 🐛 Si Aún No Funciona

### Opción 1: Verifica Permisos

Abre `manifest.json` y verifica:

```json
{
  "manifest_version": 3,
  "permissions": [
    "storage",
    "activeTab",
    "webRequest",      // ← DEBE ESTAR
    "tabs",
    "alarms",
    "notifications"
  ],
  "host_permissions": [
    "http://localhost:5000/*",
    "<all_urls>"       // ← DEBE ESTAR
  ]
}
```

### Opción 2: Reinstala la Extensión

```
1. chrome://extensions/
2. Click en "Quitar" en tu extensión
3. Recarga la página
4. "Cargar extensión sin empaquetar"
5. Selecciona chrome_extension/
```

### Opción 3: Verifica la Consola del Popup

```
1. Abre el popup (click en el ícono)
2. Click derecho → "Inspeccionar"
3. Ve a la pestaña Console
4. Busca errores
```

---

## 📝 Logs Esperados

### Service Worker (Correcto):
```
🔧 Initializing Network Monitor...
✅ chrome.webRequest is available
✅ onBeforeRequest listener added
✅ onCompleted listener added
✅ onErrorOccurred listener added
✅ Network Monitor initialized successfully!
Network Monitor started
Background service worker initialized
```

### Durante Navegación:
```
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/static/css/main.css
📡 Request detected: http://localhost:3000/favicon.ico
```

### Durante Ataque DDoS:
```
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/
📡 Request detected: http://localhost:3000/
DDoS detected: {type: "DDoS", target: "localhost:3000", requestCount: 8, severity: "high"}
```

---

## 🎉 Cuando Funcione

Verás:

1. **Consola del Service Worker**:
   - Logs de "Request detected"
   - "DDoS detected" o "Brute Force detected"

2. **Notificación de Chrome**:
   - "⚠️ DDoS Detectado"
   - "Target: localhost:3000"

3. **Badge en el Ícono**:
   - Número o "!" en negro

4. **Popup**:
   - Ataque listado en "Ataques Detectados"
   - Contador de peticiones aumentando

---

**Sigue estos pasos en orden y reporta dónde se detiene el proceso.** 🔍
