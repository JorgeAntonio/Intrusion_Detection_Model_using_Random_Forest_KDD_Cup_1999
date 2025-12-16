# 📘 Manual de Usuario - Sistema de Detección de Intrusiones con Gradient Boosting

Este manual detalla el uso del sistema web para la detección de intrusiones en redes utilizando un modelo de Machine Learning (Gradient Boosting).

## 📋 Introducción

El sistema permite a los analistas de seguridad cargar datos de tráfico de red y recibir predicciones inmediatas sobre si el tráfico es normal o representa un ataque. Utiliza un modelo entrenado con el dataset KDD.

### Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Edge, Safari).
- Conexión a la red donde se aloja el sistema (por defecto `http://localhost:3000`).
- Archivos de datos en formato CSV o TXT para analizar.

---

## 0️⃣ Inicio Rápido (Modo Fácil)

Si no eres un usuario técnico, hemos incluido archivos automáticos para iniciar el sistema con doble clic.

### Pasos para iniciar:

1.  **Iniciar el Servidor (Backend)**:
    - Busca el archivo llamado `start_backend.bat` en la carpeta del proyecto.
    - Dale doble clic.
    - Se abrirá una ventana negra (terminal). **No la cierres**.
    - Espera a que diga "SERVIDOR FLASK INICIADO".

2.  **Iniciar la Aplicación (Frontend)**:
    - Busca el archivo llamado `start_frontend.bat` en la carpeta del proyecto.
    - Dale doble clic.
    - Se abrirá otra ventana negra. **No la cierres**.
    - Espera unos segundos y automáticamente se abrirá tu navegador con el sistema listo para usar.

> **Nota**: La primera vez que los ejecutes puede tardar unos minutos instalando componentes necesarios. Ten paciencia.

---

## 🚀 Acceso al Sistema

1.  Abra su navegador web.
2.  Ingrese la dirección del sistema en la barra de direcciones (ej. `http://localhost:3000`).
3.  Verá la pantalla principal con el título **"MODELOS DE CLASIFICACIÓN DE TRÁFICO DE RED DE INFORMACIÓN CON MACHINE LEARNING"**.

---

## 🖥️ Interfaz Principal

El sistema cuenta con una barra de navegación superior con tres pestañas principales:

1.  **Cargar Datos**: Pantalla inicial para subir archivos.
2.  **Info del Modelo**: Detalles técnicos del modelo cargado.
3.  **Resultados**: (Aparece tras cargar un archivo) Dashboard con el análisis.

En la parte superior derecha, verá un indicador **"Modelo cargado"** en verde si el backend está conectado correctamente.

---

## 1️⃣ Cargar Datos

Esta es la primera acción a realizar para iniciar un análisis.

### Formatos Soportados
- **CSV (.csv) o TXT (.txt)**.
- El archivo debe contener las características numéricas del tráfico de red (features) que el modelo espera.
- **Opcional**: Puede incluir una columna `binario` con etiquetas (0 para normal, 1 para ataque) si desea evaluar la precisión del modelo contra datos conocidos (Ground Truth).

### Pasos para Cargar
1.  Haga clic en la pestaña **"Cargar Datos"**.
2.  Verá un área recuadro punteado azul.
3.  **Opción A**: Arrastre su archivo desde su carpeta y suéltelo dentro del recuadro.
4.  **Opción B**: Haga clic en el botón azul **"Seleccionar archivo"** y busque el archivo en su computadora.
5.  Una vez seleccionado, verá el nombre del archivo y su peso.
6.  Haga clic en el botón **"Analizar Datos"**.
    - *El sistema mostrará "Analizando..." mientras procesa los datos.*
7.  Al finalizar, el sistema le redirigirá automáticamente a la pestaña de **Resultados**.

---

## 2️⃣ Interpretación de Resultados

El Dashboard de resultados le ofrece una visión completa del análisis.

### Tarjetas de Resumen
En la parte superior verá 4 tarjetas clave:
- **Total de Muestras**: Número total de registros analizados en el archivo.
- **Tráfico Normal**: Cantidad y porcentaje de conexiones seguras.
- **Ataques Detectados**: Cantidad y porcentaje de conexiones maliciosas.
- **Precisión del Modelo**: (Solo si se incluyeron etiquetas reales) Porcentaje de aciertos del modelo.

### Gráficos
- **Distribución de Predicciones**: Gráfico circular que muestra visualmente la proporción entre tráfico Normal (Verde) y Ataque (Rojo).
- **Matriz de Confusión**: (Solo con etiquetas) Muestra los Verdaderos Positivos, Falsos Positivos, etc., ayudando a entender dónde se equivoca el modelo.
- **Curva ROC y Precision-Recall**: Gráficos técnicos para evaluar la calidad de la detección.

### Reporte de Clasificación
Tabla detallada que muestra métricas por clase:
- **Precision**: Qué tan exacto es cuando dice que es ataque.
- **Recall**: Cuántos ataques reales logró capturar.
- **F1-Score**: Promedio balanceado de Precision y Recall.

### Alerta de Estado
Al final de la página encontrará un recuadro de conclusión:
- **Verde (✅ Nivel de amenazas bajo)**: Si predomina el tráfico normal.
- **Rojo (⚠️ Alto nivel de amenazas detectado)**: Si se detectan ataques. Incluye una recomendación de revisar registros y tomar medidas.

---

## 3️⃣ Información del Modelo

La pestaña **"Info del Modelo"** es útil para auditores o científicos de datos que deseen verificar qué modelo está en uso.

- **Parámetros**: Muestra hiperparámetros clave como el *Learning Rate*, *Max Depth* (Profundidad máxima de los árboles) y número de *Estimadores*.
- **Métricas de Entrenamiento**: Muestra el rendimiento que tuvo el modelo durante su fase de entrenamiento (Accuracy, ROC AUC, F1 Score).
- **Descripción**: Breve explicación técnica de qué es Gradient Boosting y sus ventajas.

---

## ❓ Solución de Problemas Comunes

| Problema | Causa Posible | Solución |
| :--- | :--- | :--- |
| **Error: "No se pudo conectar con el servidor"** | El backend (Flask) está apagado. | Contacte al administrador para iniciar el servidor backend. |
| **Error al procesar archivo** | Formato de archivo incorrecto o columnas faltantes. | Asegúrese de que el CSV tenga las columnas numéricas correctas y separadores válidos. |
| **El botón "Resultados" no aparece** | Aún no se ha cargado ningún archivo. | Vaya a "Cargar Datos" y analice un archivo primero. |

---

> **Nota de Seguridad**: Este sistema es una herramienta de apoyo a la decisión. Ante una alerta de ataque, siempre verifique los logs de sus sistemas de firewall y servidores para confirmar la intrusión.
