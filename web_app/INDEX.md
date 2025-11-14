# 📚 Índice de Documentación - Gradient Boosting Dashboard

Bienvenido al sistema de visualización web para el modelo de Gradient Boosting Machine. Esta es tu guía completa para navegar por toda la documentación.

## 🚀 Inicio Rápido

### Para empezar inmediatamente:
1. **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** ⭐ **EMPIEZA AQUÍ**
   - Scripts automáticos para Windows
   - Instalación paso a paso
   - Primeros pasos

### Para ejecutar la aplicación:
- **Windows**: Ejecuta `start_backend.bat` y `start_frontend.bat`
- **Manual**: Sigue las instrucciones en [INICIO_RAPIDO.md](INICIO_RAPIDO.md)

---

## 📖 Documentación Principal

### 1. [README.md](README.md) - Documentación Completa
**Contenido:**
- ✅ Características del sistema
- 🏗️ Arquitectura completa
- 🛠️ Instalación detallada
- 🚀 Instrucciones de ejecución
- 📊 Uso de la aplicación
- 🔌 Documentación de API
- 🎨 Stack tecnológico
- 🐛 Solución de problemas

**Cuándo leerlo:** Para entender el sistema completo y referencia técnica

---

### 2. [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Guía de Inicio
**Contenido:**
- 🚀 Scripts automáticos de inicio
- 📝 Instalación manual paso a paso
- 🐛 Solución rápida de problemas
- 📊 Lista de características

**Cuándo leerlo:** Primera vez usando la aplicación

---

### 3. [EJEMPLO_USO.md](EJEMPLO_USO.md) - Casos de Uso Prácticos
**Contenido:**
- 📖 Escenarios reales de uso
- 🔄 Flujo de trabajo típico
- 📊 Interpretación de resultados
- 💡 Mejores prácticas
- 🎯 Casos de uso específicos
- 💡 Tips avanzados

**Cuándo leerlo:** Para aprender a usar efectivamente el sistema

---

### 4. [ESTRUCTURA.md](ESTRUCTURA.md) - Arquitectura del Proyecto
**Contenido:**
- 📁 Estructura de directorios
- 🔍 Descripción de componentes
- 🎨 Tecnologías y librerías
- 🔄 Flujo de datos
- 📦 Archivos generados
- 🚀 Comandos útiles

**Cuándo leerlo:** Para desarrolladores que quieren modificar el código

---

### 5. [CAPTURAS_PANTALLA.md](CAPTURAS_PANTALLA.md) - Guía Visual
**Contenido:**
- 📸 Representaciones ASCII de la UI
- 🎨 Paleta de colores
- 📱 Diseño responsive
- 🎭 Estados de la interfaz
- 🔄 Animaciones
- 📊 Iconografía

**Cuándo leerlo:** Para entender visualmente la interfaz

---

## 🗂️ Estructura de Archivos

```
web_app/
├── 📄 INDEX.md                    ← Estás aquí
├── 📄 README.md                   ← Documentación principal
├── 📄 INICIO_RAPIDO.md           ← Guía de inicio
├── 📄 EJEMPLO_USO.md             ← Casos de uso
├── 📄 ESTRUCTURA.md              ← Arquitectura
├── 📄 CAPTURAS_PANTALLA.md       ← Guía visual
│
├── 🚀 start_backend.bat          ← Iniciar backend
├── 🚀 start_frontend.bat         ← Iniciar frontend
│
├── 🔧 backend/                   ← Servidor Flask
│   ├── app.py
│   └── requirements.txt
│
└── 🎨 frontend/                  ← Aplicación React
    ├── src/
    ├── public/
    └── package.json
```

---

## 🎯 Rutas de Aprendizaje

### 👤 Usuario Final
```
1. INICIO_RAPIDO.md      → Instalar y ejecutar
2. EJEMPLO_USO.md        → Aprender a usar
3. CAPTURAS_PANTALLA.md  → Referencia visual
```

### 👨‍💻 Desarrollador
```
1. README.md             → Entender el sistema
2. ESTRUCTURA.md         → Conocer la arquitectura
3. backend/app.py        → Revisar código backend
4. frontend/src/App.js   → Revisar código frontend
```

### 🔧 Administrador de Sistemas
```
1. README.md             → Requisitos y configuración
2. INICIO_RAPIDO.md      → Instalación
3. README.md (API)       → Endpoints y seguridad
```

---

## 📋 Checklist de Instalación

### Prerrequisitos
- [ ] Python 3.8+ instalado
- [ ] Node.js 16+ instalado
- [ ] Modelo entrenado en `output/gradient_boosting_kdd_model.joblib`

### Backend
- [ ] Navegar a `web_app/backend`
- [ ] Crear entorno virtual
- [ ] Instalar dependencias (`pip install -r requirements.txt`)
- [ ] Ejecutar servidor (`python app.py`)
- [ ] Verificar en http://localhost:5000/api/health

### Frontend
- [ ] Navegar a `web_app/frontend`
- [ ] Instalar dependencias (`npm install`)
- [ ] Ejecutar aplicación (`npm start`)
- [ ] Verificar en http://localhost:3000

### Verificación
- [ ] Backend responde en puerto 5000
- [ ] Frontend carga en puerto 3000
- [ ] Modelo se carga correctamente
- [ ] Puedes subir archivos CSV
- [ ] Dashboard muestra resultados

---

## 🔗 Enlaces Rápidos

### Documentación
- [Documentación Completa](README.md)
- [Inicio Rápido](INICIO_RAPIDO.md)
- [Ejemplos de Uso](EJEMPLO_USO.md)
- [Arquitectura](ESTRUCTURA.md)
- [Guía Visual](CAPTURAS_PANTALLA.md)

### Código Fuente
- [Backend API](backend/app.py)
- [Frontend App](frontend/src/App.js)
- [Dashboard Component](frontend/src/components/Dashboard.js)
- [FileUpload Component](frontend/src/components/FileUpload.js)
- [ModelInfo Component](frontend/src/components/ModelInfo.js)

### Scripts
- [Iniciar Backend](start_backend.bat)
- [Iniciar Frontend](start_frontend.bat)

---

## 🆘 Ayuda Rápida

### Problemas Comunes

#### "Modelo no encontrado"
```bash
# Solución: Entrenar el modelo primero
cd ../../scripts
python train_gradient_boosting.py
```

#### "Puerto en uso"
```bash
# Backend (puerto 5000)
# Cambiar en: backend/app.py línea final

# Frontend (puerto 3000)
# Cambiar variable PORT antes de npm start
set PORT=3001 && npm start
```

#### "Error de CORS"
```bash
# Verificar que ambos servidores estén ejecutándose
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

#### "Dependencias faltantes"
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

---

## 📊 Características Principales

### ✨ Funcionalidades
- 📤 Carga de archivos CSV (drag & drop)
- 🔮 Predicciones en tiempo real
- 📊 Dashboard interactivo con gráficos
- 📈 Curvas ROC y Precision-Recall
- 🎯 Matriz de confusión
- 📋 Reporte de clasificación detallado
- 🧠 Información del modelo
- ⚠️ Alertas de seguridad

### 🎨 Tecnologías
- **Backend**: Flask + scikit-learn
- **Frontend**: React + TailwindCSS + Recharts
- **Visualización**: Plotly + Recharts
- **Iconos**: Lucide React

---

## 📞 Soporte

### Recursos
1. **Documentación**: Lee los archivos .md en orden
2. **Código**: Revisa los comentarios en el código fuente
3. **Logs**: Revisa la consola del backend y frontend
4. **Issues**: Reporta problemas con detalles específicos

### Información Útil para Reportar Problemas
- Sistema operativo y versión
- Versión de Python y Node.js
- Mensaje de error completo
- Pasos para reproducir el problema
- Logs de consola

---

## 🎓 Recursos Adicionales

### Aprender Más
- **Gradient Boosting**: [scikit-learn docs](https://scikit-learn.org/stable/modules/ensemble.html#gradient-boosting)
- **React**: [React docs](https://react.dev/)
- **Flask**: [Flask docs](https://flask.palletsprojects.com/)
- **TailwindCSS**: [Tailwind docs](https://tailwindcss.com/)

### Dataset
- **KDD Cup 1999**: Dataset de detección de intrusiones en redes
- Ubicación: `scripts/KDD_TRAIN_FULL.csv`

---

## 📝 Notas Importantes

⚠️ **Seguridad**: Esta aplicación es para desarrollo/demostración. Para producción:
- Implementar autenticación
- Configurar HTTPS
- Validar y sanitizar inputs
- Implementar rate limiting
- Usar variables de entorno para configuración

⚠️ **Rendimiento**: Para archivos grandes (>100MB):
- Procesar en lotes
- Considerar procesamiento asíncrono
- Implementar caché de resultados

⚠️ **Compatibilidad**: 
- Probado en Windows 10/11
- Compatible con Linux/Mac con ajustes menores en scripts

---

## 🎉 ¡Listo para Empezar!

### Siguiente Paso
👉 **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Comienza aquí para poner en marcha la aplicación

### ¿Preguntas?
Revisa la documentación relevante según tu rol:
- **Usuario**: EJEMPLO_USO.md
- **Desarrollador**: ESTRUCTURA.md + código fuente
- **Administrador**: README.md (sección instalación)

---

**Última actualización**: Noviembre 2024  
**Versión**: 1.0.0  
**Licencia**: Proyecto educativo - KDD Dataset Analysis
