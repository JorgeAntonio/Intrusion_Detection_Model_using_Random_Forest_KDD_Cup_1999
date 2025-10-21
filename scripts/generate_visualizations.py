import os
import joblib
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.figure_factory as ff
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    roc_curve,
    auc,
    precision_recall_curve,
)
from sklearn.inspection import permutation_importance
import json

# Configuración de rutas
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSV_PATH = os.path.join(os.path.dirname(__file__), "KDD_TRAIN_FULL.csv")
MODEL_PATH = os.path.join(BASE_DIR, "output", "rf_kdd_model.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "output", "rf_kdd_metrics.txt")
PLOTS_DIR = os.path.join(BASE_DIR, "output", "plots")


def load_model_and_data():
    """Cargar modelo entrenado y datos."""
    print("Cargando modelo y datos...")

    # Cargar modelo
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Modelo no encontrado en: {MODEL_PATH}")

    model = joblib.load(MODEL_PATH)

    # Cargar datos
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"Datos no encontrados en: {CSV_PATH}")

    df = pd.read_csv(CSV_PATH)
    X = df.drop(columns=["binario"])
    y = df["binario"]

    # Recrear la división train/test con la misma semilla
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    return model, X_train, X_test, y_train, y_test, df


def create_confusion_matrix_heatmap(model, X_test, y_test):
    """Crear matriz de confusión con Plotly."""
    print("Generando matriz de confusión...")

    y_pred = model.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)

    # Crear etiquetas con porcentajes
    cm_normalized = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]

    text = []
    for i in range(len(cm)):
        text.append([])
        for j in range(len(cm[i])):
            text[i].append(f"{cm[i][j]}<br>({cm_normalized[i][j]:.1%})")

    fig = ff.create_annotated_heatmap(
        z=cm,
        x=["Predicted Normal", "Predicted Attack"],
        y=["Actual Normal", "Actual Attack"],
        annotation_text=text,
        colorscale="Blues",
        showscale=True,
    )

    fig.update_layout(
        title="Matriz de Confusión - Random Forest KDD Dataset",
        xaxis_title="Predicción",
        yaxis_title="Valor Real",
        font=dict(size=12),
        width=600,
        height=500,
    )

    return fig


def create_roc_curve(model, X_test, y_test):
    """Crear curva ROC."""
    print("Generando curva ROC...")

    # Obtener probabilidades
    y_proba = model.predict_proba(X_test)[:, 1]

    # Calcular ROC
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    roc_auc = auc(fpr, tpr)

    fig = go.Figure()

    # Curva ROC
    fig.add_trace(
        go.Scatter(
            x=fpr,
            y=tpr,
            mode="lines",
            name=f"ROC (AUC = {roc_auc:.4f})",
            line=dict(color="darkorange", width=2),
        )
    )

    # Línea diagonal de referencia
    fig.add_trace(
        go.Scatter(
            x=[0, 1],
            y=[0, 1],
            mode="lines",
            name="Referencia (AUC = 0.5)",
            line=dict(color="navy", width=2, dash="dash"),
        )
    )

    fig.update_layout(
        title=f"Curva ROC - Random Forest (AUC = {roc_auc:.4f})",
        xaxis_title="Tasa de Falsos Positivos",
        yaxis_title="Tasa de Verdaderos Positivos",
        width=600,
        height=500,
        showlegend=True,
    )

    return fig


def create_precision_recall_curve(model, X_test, y_test):
    """Crear curva Precision-Recall."""
    print("Generando curva Precision-Recall...")

    y_proba = model.predict_proba(X_test)[:, 1]
    precision, recall, _ = precision_recall_curve(y_test, y_proba)
    pr_auc = auc(recall, precision)

    fig = go.Figure()

    fig.add_trace(
        go.Scatter(
            x=recall,
            y=precision,
            mode="lines",
            name=f"PR Curve (AUC = {pr_auc:.4f})",
            line=dict(color="darkgreen", width=2),
        )
    )

    fig.update_layout(
        title=f"Curva Precision-Recall (AUC = {pr_auc:.4f})",
        xaxis_title="Recall",
        yaxis_title="Precision",
        width=600,
        height=500,
    )

    return fig


def create_feature_importance_plot(model, X_train):
    """Crear gráfico de importancia de características."""
    print("Generando gráfico de importancia de características...")

    feature_names = X_train.columns.tolist()
    importances = model.feature_importances_

    # Crear DataFrame y ordenar por importancia
    importance_df = (
        pd.DataFrame({"Feature": feature_names, "Importance": importances})
        .sort_values("Importance", ascending=True)
        .tail(15)
    )  # Top 15 características

    fig = go.Figure(
        go.Bar(
            x=importance_df["Importance"],
            y=importance_df["Feature"],
            orientation="h",
            marker_color="lightblue",
            text=[f"{imp:.4f}" for imp in importance_df["Importance"]],
            textposition="outside",
        )
    )

    fig.update_layout(
        title="Top 15 Características Más Importantes",
        xaxis_title="Importancia",
        yaxis_title="Características",
        width=800,
        height=600,
        margin=dict(l=150),
    )

    return fig


def create_class_distribution_plot(df):
    """Crear gráfico de distribución de clases."""
    print("Generando gráfico de distribución de clases...")

    class_counts = df["binario"].value_counts()

    fig = go.Figure(
        data=[
            go.Bar(
                x=["Normal (0)", "Attack (1)"],
                y=[class_counts[0], class_counts[1]],
                marker_color=["lightblue", "lightcoral"],
                text=[f"{class_counts[0]:,}", f"{class_counts[1]:,}"],
                textposition="outside",
            )
        ]
    )

    fig.update_layout(
        title="Distribución de Clases en el Dataset KDD",
        xaxis_title="Clase",
        yaxis_title="Número de Muestras",
        width=600,
        height=500,
    )

    return fig


def create_performance_summary(model, X_test, y_test):
    """Crear resumen de rendimiento del modelo."""
    print("Generando resumen de rendimiento...")

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    # Métricas
    from sklearn.metrics import (
        accuracy_score,
        precision_score,
        recall_score,
        f1_score,
        roc_auc_score,
    )

    metrics = {
        "Accuracy": accuracy_score(y_test, y_pred),
        "Precision": precision_score(y_test, y_pred),
        "Recall": recall_score(y_test, y_pred),
        "F1-Score": f1_score(y_test, y_pred),
        "ROC-AUC": roc_auc_score(y_test, y_proba),
    }

    # Crear gráfico de barras
    fig = go.Figure(
        data=[
            go.Bar(
                x=list(metrics.keys()),
                y=list(metrics.values()),
                marker_color=[
                    "skyblue",
                    "lightgreen",
                    "lightcoral",
                    "lightyellow",
                    "lightpink",
                ],
                text=[f"{v:.4f}" for v in metrics.values()],
                textposition="outside",
            )
        ]
    )

    fig.update_layout(
        title="Métricas de Rendimiento del Modelo",
        xaxis_title="Métrica",
        yaxis_title="Score",
        yaxis=dict(range=[0, 1.1]),
        width=700,
        height=500,
    )

    return fig


def save_plots():
    """Función principal para generar y guardar todas las visualizaciones."""
    # Crear directorio para plots
    os.makedirs(PLOTS_DIR, exist_ok=True)

    # Cargar datos y modelo
    model, X_train, X_test, y_train, y_test, df = load_model_and_data()

    plots = {
        "confusion_matrix": create_confusion_matrix_heatmap(model, X_test, y_test),
        "roc_curve": create_roc_curve(model, X_test, y_test),
        "precision_recall": create_precision_recall_curve(model, X_test, y_test),
        "feature_importance": create_feature_importance_plot(model, X_train),
        "class_distribution": create_class_distribution_plot(df),
        "performance_summary": create_performance_summary(model, X_test, y_test),
    }

    # Guardar cada plot como HTML e imagen
    for name, fig in plots.items():
        # HTML interactivo
        html_path = os.path.join(PLOTS_DIR, f"{name}.html")
        fig.write_html(html_path)

        # PNG estático
        png_path = os.path.join(PLOTS_DIR, f"{name}.png")
        fig.write_image(png_path, width=800, height=600, scale=2)

        print(f"✅ {name} guardado en {html_path} y {png_path}")

    print(f"\n🎉 Todas las visualizaciones han sido guardadas en: {PLOTS_DIR}")
    print("📊 Archivos HTML para gráficos interactivos")
    print("🖼️  Archivos PNG para imágenes estáticas")


if __name__ == "__main__":
    save_plots()
