# 🐛 Errores Comunes y Soluciones

## Errores de Manifest V3

### ❌ Error: `chrome.action.openPopup()` no funciona

**Mensaje de error**:
```
Error in event handler: Error: This function must be called during a user gesture
```

**Causa**: 
En Manifest V3, `chrome.action.openPopup()` solo puede ser llamado en respuesta directa a una acción del usuario (click, keyboard shortcut, etc.). No funciona en service workers o eventos programáticos.

**Solución**:
```javascript
// ❌ NO FUNCIONA en Manifest V3
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.action.openPopup(); // Error!
});

// ✅ SOLUCIÓN: El usuario debe hacer click en el ícono
// No hay forma programática de abrir el popup en Manifest V3
// El popup se abre automáticamente cuando el usuario hace click en el ícono
```

**Alternativa**:
Si necesitas abrir una interfaz programáticamente, usa una nueva pestaña:
```javascript
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.create({ url: 'popup-realtime.html' });
});
```

---

### ❌ Error: `importScripts` no encuentra el archivo

**Mensaje de error**:
```
Uncaught (in promise) Error: Failed to load 'network-monitor.js'
```

**Causa**: 
El archivo no existe o la ruta es incorrecta.

**Solución**:
1. Verifica que el archivo existe en la carpeta de la extensión
2. La ruta debe ser relativa a la raíz de la extensión
3. No uses `/` al inicio de la ruta

```javascript
// ❌ Incorrecto
importScripts('/network-monitor.js');

// ✅ Correcto
importScripts('network-monitor.js');
```

---

### ❌ Error: Permisos insuficientes

**Mensaje de error**:
```
Uncaught TypeError: Cannot read property 'onBeforeRequest' of undefined
```

**Causa**: 
Falta el permiso `webRequest` en el manifest.

**Solución**:
Verifica que `manifest.json` tenga todos los permisos necesarios:

```json
{
  "permissions": [
    "storage",
    "activeTab",
    "webRequest",
    "tabs",
    "alarms",
    "notifications"
  ],
  "host_permissions": [
    "<all_urls>"
  ]
}
```

---

### ❌ Error: Service Worker se detiene

**Mensaje de error**:
```
Service worker stopped
```

**Causa**: 
Los service workers en Chrome se detienen después de 30 segundos de inactividad.

**Solución**:
Esto es normal. El service worker se reiniciará automáticamente cuando sea necesario. Asegúrate de:

1. No mantener estado en variables globales
2. Usar `chrome.storage` para persistir datos
3. Reinicializar el monitor cuando el service worker se reactive

```javascript
// ✅ Correcto: Reinicializar en cada carga
let networkMonitor = null;

function initNetworkMonitor() {
  if (!networkMonitor) {
    networkMonitor = new NetworkMonitor();
  }
}

// Inicializar al cargar
initNetworkMonitor();
```

---

## Errores de Detección de Ataques

### ❌ No se detectan ataques

**Posibles causas**:

1. **Umbral muy alto**
   ```javascript
   // Si el umbral es 100, necesitas 100+ peticiones/segundo
   ddosThreshold: 100
   
   // Solución: Reducir para pruebas
   ddosThreshold: 10
   ```

2. **Monitoreo desactivado**
   ```javascript
   // Verificar en chrome.storage
   chrome.storage.local.get(['monitoringEnabled'], (result) => {
     console.log('Monitoring:', result.monitoringEnabled);
   });
   ```

3. **Service worker no inicializado**
   ```javascript
   // Verificar en consola del service worker
   console.log('Monitor:', networkMonitor);
   ```

**Solución**:
1. Abre DevTools del service worker: `chrome://extensions/` → "service worker"
2. Verifica que no haya errores
3. Verifica que `networkMonitor` esté inicializado
4. Reduce los umbrales para pruebas

---

### ❌ Demasiadas notificaciones

**Causa**: 
Umbrales muy bajos o sitios con mucho tráfico.

**Solución**:
1. Aumentar umbrales:
   ```javascript
   ddosThreshold: 200,
   bruteForceThreshold: 20
   ```

2. Desactivar notificaciones:
   ```javascript
   chrome.storage.local.set({ notifications: false });
   ```

3. Filtrar dominios específicos:
   ```javascript
   // En network-monitor.js
   const ignoredDomains = ['cdn.example.com', 'analytics.google.com'];
   
   if (ignoredDomains.includes(this.extractDomain(request.url))) {
     return; // Ignorar
   }
   ```

---

## Errores de Interfaz

### ❌ Popup no se actualiza

**Causa**: 
El popup se cierra y pierde el estado cuando pierdes el foco.

**Solución**:
Los datos se actualizan cada 2 segundos desde el background. Si el popup no se actualiza:

1. Verifica la consola del popup (click derecho → Inspeccionar)
2. Verifica que `updateStats()` se esté llamando
3. Verifica que el background responda a los mensajes

```javascript
// En popup-realtime.js
chrome.runtime.sendMessage(
  { action: 'getNetworkStats' },
  (stats) => {
    console.log('Stats received:', stats); // Debug
    if (stats && !stats.error) {
      displayStats(stats);
    }
  }
);
```

---

### ❌ Estilos no se aplican

**Causa**: 
CSS no se carga o hay conflictos.

**Solución**:
1. Verifica que `styles.css` esté en la misma carpeta
2. Verifica el link en el HTML:
   ```html
   <link rel="stylesheet" href="styles.css">
   ```
3. Recarga la extensión en `chrome://extensions/`

---

## Errores de Rendimiento

### ❌ Extensión consume mucha memoria

**Causa**: 
Demasiadas peticiones guardadas en memoria.

**Solución**:
El código ya limita a 1000 peticiones, pero puedes reducir:

```javascript
// En network-monitor.js, línea ~75
if (this.requests.length > 500) { // Reducir de 1000 a 500
  this.requests.shift();
}
```

O limpiar manualmente:
```javascript
// Desde el popup
chrome.runtime.sendMessage({ action: 'clearMonitor' });
```

---

### ❌ Navegación lenta

**Causa**: 
El monitoreo de red puede afectar ligeramente el rendimiento.

**Solución**:
1. Desactivar temporalmente:
   - Toggle en el popup
   
2. Filtrar tipos de peticiones:
   ```javascript
   // En network-monitor.js
   onRequest(details) {
     // Ignorar imágenes, CSS, etc.
     if (['image', 'stylesheet', 'font'].includes(details.type)) {
       return;
     }
     // ... resto del código
   }
   ```

---

## Errores de Instalación

### ❌ "Manifest file is missing or unreadable"

**Causa**: 
El archivo `manifest.json` tiene errores de sintaxis.

**Solución**:
1. Verifica que sea JSON válido (usa un validador online)
2. Verifica que no falten comas o llaves
3. Verifica que los permisos sean correctos

```json
{
  "manifest_version": 3,
  "name": "Network Analyzer",
  "version": "2.0.0",
  // ... resto del manifest
}
```

---

### ❌ "Could not load icon"

**Causa**: 
Los archivos de iconos no existen.

**Solución**:
1. Ejecuta el script de generación:
   ```bash
   python create_icons.py
   ```

2. O crea iconos manualmente en la carpeta `icons/`:
   - `icon16.png` (16x16)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)

---

## Debug y Diagnóstico

### Cómo debuggear la extensión

#### 1. Service Worker (Background)
```
1. Abre chrome://extensions/
2. Encuentra tu extensión
3. Click en "service worker"
4. Se abre DevTools del background
5. Verifica errores en Console
```

#### 2. Popup
```
1. Abre el popup (click en el ícono)
2. Click derecho en el popup
3. "Inspeccionar" o "Inspect"
4. Se abre DevTools del popup
5. Verifica errores en Console
```

#### 3. Network Monitor
```javascript
// Agregar logs en network-monitor.js
detectDDoS(request) {
  console.log('Checking DDoS for:', request.url);
  // ... resto del código
}
```

---

## Comandos Útiles para Debug

### Ver estado del monitor
```javascript
// En consola del service worker
console.log('Monitor:', networkMonitor);
console.log('Stats:', networkMonitor.getStats());
console.log('Attacks:', networkMonitor.getAttacks());
```

### Ver storage
```javascript
// En consola del popup o service worker
chrome.storage.local.get(null, (data) => {
  console.log('Storage:', data);
});
```

### Limpiar storage
```javascript
chrome.storage.local.clear(() => {
  console.log('Storage cleared');
});
```

### Reiniciar monitor
```javascript
// En consola del service worker
networkMonitor.clear();
initNetworkMonitor();
```

---

## Checklist de Verificación

Antes de reportar un error, verifica:

- [ ] Los iconos existen en `icons/`
- [ ] El `manifest.json` es JSON válido
- [ ] Todos los archivos están en la carpeta correcta
- [ ] La extensión está recargada en `chrome://extensions/`
- [ ] No hay errores en la consola del service worker
- [ ] No hay errores en la consola del popup
- [ ] Los permisos están correctos en el manifest
- [ ] El monitoreo está activado (toggle en el popup)

---

## Reportar Errores

Si encuentras un error no listado aquí, incluye:

1. **Mensaje de error completo**
2. **Pasos para reproducir**
3. **Versión de Chrome**: `chrome://version/`
4. **Consola del service worker**: Screenshot o texto
5. **Consola del popup**: Screenshot o texto
6. **Configuración**: 
   ```javascript
   chrome.storage.local.get(null, console.log);
   ```

---

## Recursos Adicionales

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [webRequest API](https://developer.chrome.com/docs/extensions/reference/webRequest/)
- [Service Workers](https://developer.chrome.com/docs/extensions/mv3/service_workers/)

---

**Última actualización**: Noviembre 2024  
**Versión de la extensión**: 2.0.0
