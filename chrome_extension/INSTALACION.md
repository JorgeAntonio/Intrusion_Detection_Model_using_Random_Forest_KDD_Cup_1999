# 📦 Guía de Instalación Rápida - Extensión de Chrome

## ⚡ Instalación en 3 Pasos

### Paso 1: Crear Iconos 🎨

La extensión necesita 3 iconos. Tienes varias opciones:

#### Opción A: Iconos Temporales (Más Rápido)
Crea archivos PNG simples de cualquier color:

1. Abre Paint o cualquier editor de imágenes
2. Crea 3 imágenes:
   - `icon16.png` → 16x16 píxeles
   - `icon48.png` → 48x48 píxeles  
   - `icon128.png` → 128x128 píxeles
3. Guárdalas en la carpeta `chrome_extension/icons/`

#### Opción B: Usar Python para Generar Iconos
Ejecuta este script en la carpeta `chrome_extension`:

```python
# create_icons.py
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    # Crear imagen con gradiente
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Dibujar círculo con gradiente
    for i in range(size//2):
        color = (102 - i//2, 126 - i//2, 234 - i//2)
        draw.ellipse([i, i, size-i, size-i], fill=color)
    
    # Guardar
    img.save(f'icons/{filename}')
    print(f'✓ Creado: {filename}')

# Crear carpeta icons si no existe
import os
os.makedirs('icons', exist_ok=True)

# Crear iconos
create_icon(16, 'icon16.png')
create_icon(48, 'icon48.png')
create_icon(128, 'icon128.png')

print('\n✅ Iconos creados exitosamente!')
```

Ejecuta:
```bash
pip install Pillow
python create_icons.py
```

#### Opción C: Descargar Iconos Online
1. Ve a [Flaticon](https://www.flaticon.com/free-icon/network_2103633)
2. Busca "network security"
3. Descarga en formato PNG
4. Redimensiona a 16x16, 48x48 y 128x128
5. Guarda en `chrome_extension/icons/`

### Paso 2: Iniciar el Backend 🚀

El backend debe estar ejecutándose para que la extensión funcione:

```bash
# Opción 1: Script automático
cd web_app
start_backend.bat

# Opción 2: Manual
cd web_app/backend
venv\Scripts\activate
python app.py
```

Verifica que esté ejecutándose en: http://localhost:5000

### Paso 3: Instalar en Chrome 🔌

1. **Abrir Chrome Extensions**
   - Escribe en la barra: `chrome://extensions/`
   - O: Menú (⋮) → Más herramientas → Extensiones

2. **Activar Modo Desarrollador**
   - Activa el switch en la esquina superior derecha

3. **Cargar Extensión**
   - Click en "Cargar extensión sin empaquetar"
   - Navega a la carpeta `chrome_extension`
   - Click en "Seleccionar carpeta"

4. **¡Listo!** 🎉
   - La extensión aparecerá en tu barra de herramientas
   - Click en el ícono para abrirla

## 🎯 Primer Uso

1. **Click en el ícono de la extensión**
   - Verás el popup con información del modelo

2. **Verificar conexión**
   - Debe mostrar "● Conectado" en verde
   - Si muestra error, verifica que el backend esté ejecutándose

3. **Cargar un archivo CSV**
   - Click en "Seleccionar archivo CSV"
   - Selecciona `scripts/KDD_TRAIN_FULL.csv` para probar

4. **Analizar**
   - Click en "Analizar"
   - Espera los resultados (5-10 segundos)

5. **Ver resultados**
   - Verás el resumen de predicciones
   - Métricas de evaluación
   - Alertas de seguridad

## ✅ Verificación

### Checklist de Instalación

- [ ] Iconos creados en `chrome_extension/icons/`
- [ ] Backend ejecutándose en http://localhost:5000
- [ ] Extensión cargada en Chrome
- [ ] Extensión muestra "Conectado" en verde
- [ ] Puedes cargar archivos CSV
- [ ] Los análisis funcionan correctamente

### Probar la Extensión

```bash
# 1. Verificar backend
curl http://localhost:5000/api/health

# Debería responder:
# {"status":"ok","model":"Gradient Boosting Classifier",...}
```

## 🐛 Problemas Comunes

### ❌ "API no disponible"
**Solución**: Inicia el backend
```bash
cd web_app/backend
python app.py
```

### ❌ "Iconos no se muestran"
**Solución**: Crea los archivos PNG en `icons/`
```
chrome_extension/
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### ❌ "Error al cargar extensión"
**Solución**: Verifica que todos los archivos existan:
```
chrome_extension/
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
├── background.js
└── icons/
```

### ❌ "CORS Error"
**Solución**: Ya está configurado en el backend. Si persiste:
1. Verifica que `flask-cors` esté instalado
2. Reinicia el backend

## 🎨 Personalización

### Cambiar Colores
Edita `styles.css`:
```css
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Cambia estos colores */
}
```

### Cambiar Puerto del API
Edita `popup.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
// Cambia el puerto si es necesario
```

### Cambiar Nombre
Edita `manifest.json`:
```json
{
  "name": "Tu Nombre Aquí",
  "description": "Tu descripción aquí"
}
```

## 📱 Usar en Otros Navegadores

### Microsoft Edge
1. Ve a `edge://extensions/`
2. Activa "Modo de desarrollador"
3. "Cargar desempaquetada"
4. Selecciona la carpeta `chrome_extension`

### Brave
1. Ve a `brave://extensions/`
2. Activa "Modo de desarrollador"
3. "Cargar extensión desempaquetada"
4. Selecciona la carpeta `chrome_extension`

### Opera
1. Ve a `opera://extensions/`
2. Activa "Modo de desarrollador"
3. "Cargar extensión desempaquetada"
4. Selecciona la carpeta `chrome_extension`

## 🚀 Siguientes Pasos

1. **Prueba con diferentes archivos CSV**
   - Usa tus propios datos de red
   - Experimenta con diferentes tamaños

2. **Explora el Dashboard Completo**
   - Click en "Abrir Dashboard Completo"
   - Visualizaciones más detalladas

3. **Configura Notificaciones**
   - Recibe alertas de amenazas
   - Personaliza umbrales

4. **Revisa el Historial**
   - Los últimos 10 análisis se guardan
   - Compara resultados

## 📚 Documentación Adicional

- [README.md](README.md) - Documentación completa
- [../web_app/README.md](../web_app/README.md) - Documentación del backend
- [manifest.json](manifest.json) - Configuración de la extensión

## 💡 Tips

- **Ancla la extensión**: Click en el ícono de puzzle → Pin
- **Atajo de teclado**: Configura uno en `chrome://extensions/shortcuts`
- **Modo oscuro**: Próximamente disponible
- **Exportar resultados**: Usa el dashboard completo

---

¿Problemas? Revisa el [README.md](README.md) completo o reporta un issue.

**¡Disfruta analizando tráfico de red con Machine Learning!** 🎉
