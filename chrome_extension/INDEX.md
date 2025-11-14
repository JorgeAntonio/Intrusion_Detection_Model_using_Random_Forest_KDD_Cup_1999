# 📑 Índice - Extensión de Chrome

## 🚀 Inicio Rápido

**¿Primera vez?** → [INSTALACION.md](INSTALACION.md)

**¿Necesitas ayuda?** → [README.md](README.md)

---

## 📂 Estructura de Archivos

```
chrome_extension/
│
├── 📄 manifest.json           # Configuración de la extensión
├── 📄 popup.html             # Interfaz del popup
├── 📄 popup.js               # Lógica del popup
├── 📄 styles.css             # Estilos CSS
├── 📄 background.js          # Service worker
│
├── 🐍 create_icons.py        # Script para generar iconos
│
├── 📁 icons/                 # Iconos de la extensión
│   ├── icon16.png           # 16x16 px
│   ├── icon48.png           # 48x48 px
│   └── icon128.png          # 128x128 px
│
├── 📖 README.md              # Documentación completa
├── 📖 INSTALACION.md         # Guía de instalación
└── 📖 INDEX.md               # Este archivo
```

---

## 📚 Documentación

### [INSTALACION.md](INSTALACION.md) - Guía de Instalación Rápida
**Lee esto primero si es tu primera vez**

- ✅ Instalación en 3 pasos
- 🎨 Cómo crear los iconos
- 🚀 Primer uso
- 🐛 Problemas comunes
- 🎨 Personalización básica

### [README.md](README.md) - Documentación Completa
**Referencia completa de la extensión**

- 🌟 Características
- 📦 Instalación detallada
- 🚀 Guía de uso
- ⚙️ Configuración avanzada
- 🐛 Solución de problemas
- 📊 Formato de archivos
- 🔐 Seguridad y privacidad
- 📝 Desarrollo

---

## ⚡ Instalación Rápida

### 1. Generar Iconos
```bash
cd chrome_extension
python create_icons.py
```

### 2. Iniciar Backend
```bash
cd ../web_app/backend
python app.py
```

### 3. Cargar en Chrome
1. Abre `chrome://extensions/`
2. Activa "Modo de desarrollador"
3. Click "Cargar extensión sin empaquetar"
4. Selecciona carpeta `chrome_extension`

---

## 🎯 Características Principales

### ✨ Análisis Rápido
- Analiza archivos CSV desde el navegador
- Resultados en segundos
- Sin necesidad de abrir aplicaciones externas

### 📊 Dashboard Integrado
- Visualiza predicciones en tiempo real
- Métricas del modelo
- Alertas de seguridad

### 🔔 Notificaciones
- Alertas automáticas para amenazas
- Notificaciones del sistema
- Historial de análisis

### ⚡ Acceso Rápido
- Popup accesible con un clic
- Integración con menú contextual
- Atajos de teclado (próximamente)

---

## 🔧 Archivos Principales

### `manifest.json`
Configuración de la extensión:
- Permisos
- Iconos
- Versión
- Descripción

### `popup.html` + `popup.js`
Interfaz principal:
- Información del modelo
- Carga de archivos
- Visualización de resultados

### `background.js`
Service worker:
- Verificación de API
- Notificaciones
- Historial
- Menú contextual

### `styles.css`
Estilos de la interfaz:
- Diseño moderno
- Gradientes
- Animaciones
- Responsive

---

## 🎨 Personalización

### Cambiar Colores
Edita `styles.css`:
```css
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Cambiar API URL
Edita `popup.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

### Cambiar Nombre
Edita `manifest.json`:
```json
{
  "name": "Tu Nombre Aquí"
}
```

---

## 🐛 Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| API no disponible | Inicia el backend: `python app.py` |
| Iconos faltantes | Ejecuta: `python create_icons.py` |
| Error de CORS | Ya está configurado en el backend |
| Extensión no carga | Verifica que todos los archivos existan |

---

## 📊 Flujo de Uso

```
1. Usuario abre extensión
   ↓
2. Extensión verifica API
   ↓
3. Usuario carga archivo CSV
   ↓
4. Extensión envía a backend
   ↓
5. Backend procesa con modelo
   ↓
6. Extensión muestra resultados
   ↓
7. Usuario ve predicciones y métricas
```

---

## 🔗 Enlaces Útiles

### Documentación
- [Instalación Rápida](INSTALACION.md)
- [Documentación Completa](README.md)
- [Backend API](../web_app/backend/app.py)
- [Dashboard Web](../web_app/README.md)

### Chrome APIs
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

---

## 📈 Roadmap

### Versión 1.0 (Actual)
- ✅ Análisis de archivos CSV
- ✅ Visualización de resultados
- ✅ Información del modelo
- ✅ Notificaciones básicas

### Versión 1.1 (Próxima)
- [ ] Análisis de múltiples archivos
- [ ] Gráficos interactivos
- [ ] Exportar resultados
- [ ] Modo oscuro

### Versión 2.0 (Futuro)
- [ ] Análisis en tiempo real
- [ ] Comparación de análisis
- [ ] Configuración avanzada
- [ ] Integración con otras herramientas

---

## 🤝 Contribuir

¿Quieres mejorar la extensión?

1. Revisa el código en los archivos `.js`
2. Haz tus cambios
3. Prueba en Chrome
4. Documenta los cambios
5. Comparte tus mejoras

---

## 💡 Tips y Trucos

### Anclar la Extensión
Click en el ícono de puzzle → Pin junto a "Network Analyzer"

### Acceso Rápido
Configura un atajo de teclado en `chrome://extensions/shortcuts`

### Debug
Click derecho en el ícono → "Inspeccionar popup"

### Recargar Cambios
En `chrome://extensions/` → Click en 🔄 de tu extensión

---

## 📞 Soporte

### Recursos
1. **Documentación**: Lee [README.md](README.md)
2. **Instalación**: Sigue [INSTALACION.md](INSTALACION.md)
3. **Backend**: Revisa [../web_app/README.md](../web_app/README.md)
4. **Código**: Inspecciona los archivos `.js`

### Reportar Problemas
Incluye:
- Versión de Chrome
- Sistema operativo
- Mensaje de error completo
- Pasos para reproducir

---

## 📝 Notas Importantes

⚠️ **Requisitos**:
- Chrome 88+ (o navegador compatible)
- Backend ejecutándose en http://localhost:5000
- Modelo entrenado en `output/gradient_boosting_kdd_model.joblib`

⚠️ **Seguridad**:
- Los datos se procesan localmente
- No se envían a servidores externos
- El historial se guarda solo en tu navegador

⚠️ **Desarrollo**:
- Esta es una extensión en modo desarrollador
- No está publicada en Chrome Web Store
- Perfecta para uso personal o educativo

---

## 🎉 ¡Listo para Empezar!

### Siguiente Paso
👉 **[INSTALACION.md](INSTALACION.md)** - Instala la extensión en 3 pasos

### ¿Preguntas?
📖 **[README.md](README.md)** - Documentación completa

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2024  
**Licencia**: Proyecto educativo
