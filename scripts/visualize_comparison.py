import os
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
COMPARISON_CSV = os.path.join(OUTPUT_DIR, "models_comparison.csv")
PLOTS_DIR = os.path.join(OUTPUT_DIR, "comparison_plots")


def create_metrics_comparison_bar(df):
    """Crea grafico de barras comparando metricas principales."""
    print("Generando grafico de comparacion de metricas...")
    
    metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC']
    
    fig = go.Figure()
    
    colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
    
    for idx, metric in enumerate(metrics):
        if metric in df.columns:
            fig.add_trace(go.Bar(
                name=metric,
                x=df['Model'],
                y=df[metric],
                text=[f'{v:.4f}' for v in df[metric]],
                textposition='outside',
                marker_color=colors[idx]
            ))
    
    fig.update_layout(
        title='Comparacion de Metricas por Modelo',
        xaxis_title='Modelo',
        yaxis_title='Score',
        yaxis=dict(range=[0.95, 1.01]),
        barmode='group',
        width=1000,
        height=600,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        )
    )
    
    return fig


def create_errors_comparison(df):
    """Crea grafico comparando errores (FP y FN)."""
    print("Generando grafico de comparacion de errores...")
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        name='Falsos Positivos',
        x=df['Model'],
        y=df['False_Positives'],
        text=df['False_Positives'].astype(int),
        textposition='outside',
        marker_color='lightcoral'
    ))
    
    fig.add_trace(go.Bar(
        name='Falsos Negativos',
        x=df['Model'],
        y=df['False_Negatives'],
        text=df['False_Negatives'].astype(int),
        textposition='outside',
        marker_color='lightsalmon'
    ))
    
    fig.update_layout(
        title='Comparacion de Errores por Modelo',
        xaxis_title='Modelo',
        yaxis_title='Numero de Errores',
        barmode='group',
        width=900,
        height=600
    )
    
    return fig


def create_confusion_matrix_comparison(df):
    """Crea subplots con matrices de confusion de cada modelo."""
    print("Generando comparacion de matrices de confusion...")
    
    n_models = len(df)
    cols = 2
    rows = (n_models + 1) // 2
    
    fig = make_subplots(
        rows=rows, cols=cols,
        subplot_titles=df['Model'].tolist(),
        specs=[[{'type': 'heatmap'} for _ in range(cols)] for _ in range(rows)]
    )
    
    for idx, (_, row) in enumerate(df.iterrows()):
        r = idx // cols + 1
        c = idx % cols + 1
        
        cm = [
            [row['True_Negatives'], row['False_Positives']],
            [row['False_Negatives'], row['True_Positives']]
        ]
        
        fig.add_trace(
            go.Heatmap(
                z=cm,
                x=['Pred Normal', 'Pred Attack'],
                y=['Real Normal', 'Real Attack'],
                colorscale='Blues',
                showscale=(idx == 0),
                text=cm,
                texttemplate='%{text}',
                textfont={"size": 14}
            ),
            row=r, col=c
        )
    
    fig.update_layout(
        title_text='Matrices de Confusion - Comparacion de Modelos',
        width=1000,
        height=600 * rows // 2,
        showlegend=False
    )
    
    return fig


def create_performance_radar(df):
    """Crea grafico de radar comparando modelos."""
    print("Generando grafico de radar...")
    
    metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC']
    
    fig = go.Figure()
    
    colors = ['blue', 'red', 'green', 'orange', 'purple']
    
    for idx, (_, row) in enumerate(df.iterrows()):
        values = [row[m] for m in metrics if m in df.columns]
        values.append(values[0])  # Cerrar el poligono
        
        fig.add_trace(go.Scatterpolar(
            r=values,
            theta=metrics + [metrics[0]],
            fill='toself',
            name=row['Model'],
            line_color=colors[idx % len(colors)]
        ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0.95, 1.0]
            )
        ),
        title='Comparacion Multidimensional de Modelos',
        width=800,
        height=700,
        showlegend=True
    )
    
    return fig


def create_time_comparison(df):
    """Crea grafico comparando tiempos de prediccion."""
    print("Generando grafico de tiempos de prediccion...")
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        x=df['Model'],
        y=df['Prediction_Time'],
        text=[f'{t:.4f}s' for t in df['Prediction_Time']],
        textposition='outside',
        marker_color='lightblue'
    ))
    
    fig.update_layout(
        title='Tiempo de Prediccion por Modelo',
        xaxis_title='Modelo',
        yaxis_title='Tiempo (segundos)',
        width=800,
        height=500
    )
    
    return fig


def create_ranking_table(df):
    """Crea tabla visual con ranking de modelos."""
    print("Generando tabla de ranking...")
    
    # Ordenar por F1-Score
    df_sorted = df.sort_values('F1-Score', ascending=False).reset_index(drop=True)
    df_sorted['Rank'] = range(1, len(df_sorted) + 1)
    
    # Crear colores para el ranking
    colors = ['gold', 'silver', '#CD7F32', 'lightgray']
    row_colors = [colors[min(i, 3)] for i in range(len(df_sorted))]
    
    fig = go.Figure(data=[go.Table(
        header=dict(
            values=['Rank', 'Modelo', 'Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC'],
            fill_color='paleturquoise',
            align='center',
            font=dict(size=12, color='black')
        ),
        cells=dict(
            values=[
                df_sorted['Rank'],
                df_sorted['Model'],
                [f'{v:.6f}' for v in df_sorted['Accuracy']],
                [f'{v:.6f}' for v in df_sorted['Precision']],
                [f'{v:.6f}' for v in df_sorted['Recall']],
                [f'{v:.6f}' for v in df_sorted['F1-Score']],
                [f'{v:.6f}' if pd.notna(v) else 'N/A' for v in df_sorted['ROC-AUC']]
            ],
            fill_color=[row_colors],
            align='center',
            font=dict(size=11)
        )
    )])
    
    fig.update_layout(
        title='Ranking de Modelos por Rendimiento',
        width=1000,
        height=400
    )
    
    return fig


def create_error_rate_comparison(df):
    """Crea grafico comparando tasas de error."""
    print("Generando grafico de tasas de error...")
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        name='Tasa de Falsos Positivos',
        x=df['Model'],
        y=df['FP_Rate'] * 100,
        text=[f'{v:.3f}%' for v in df['FP_Rate'] * 100],
        textposition='outside',
        marker_color='lightcoral'
    ))
    
    fig.add_trace(go.Bar(
        name='Tasa de Falsos Negativos',
        x=df['Model'],
        y=df['FN_Rate'] * 100,
        text=[f'{v:.3f}%' for v in df['FN_Rate'] * 100],
        textposition='outside',
        marker_color='lightsalmon'
    ))
    
    fig.update_layout(
        title='Tasas de Error por Modelo (%)',
        xaxis_title='Modelo',
        yaxis_title='Tasa de Error (%)',
        barmode='group',
        width=900,
        height=600
    )
    
    return fig


def main():
    print("="*70)
    print("GENERANDO VISUALIZACIONES COMPARATIVAS")
    print("="*70)
    
    # Verificar que existe el archivo de comparacion
    if not os.path.exists(COMPARISON_CSV):
        print(f"\nError: No se encontro {COMPARISON_CSV}")
        print("Ejecuta primero: python scripts/compare_models.py")
        return
    
    # Cargar datos
    print("\nCargando datos de comparacion...")
    df = pd.read_csv(COMPARISON_CSV)
    print(f"Modelos encontrados: {len(df)}")
    
    # Crear directorio para plots
    os.makedirs(PLOTS_DIR, exist_ok=True)
    
    # Generar visualizaciones
    plots = {
        'metrics_comparison': create_metrics_comparison_bar(df),
        'errors_comparison': create_errors_comparison(df),
        'confusion_matrices': create_confusion_matrix_comparison(df),
        'performance_radar': create_performance_radar(df),
        'time_comparison': create_time_comparison(df),
        'ranking_table': create_ranking_table(df),
        'error_rates': create_error_rate_comparison(df)
    }
    
    # Guardar cada plot
    print("\n" + "="*70)
    print("GUARDANDO VISUALIZACIONES")
    print("="*70)
    
    for name, fig in plots.items():
        # HTML interactivo
        html_path = os.path.join(PLOTS_DIR, f"{name}.html")
        fig.write_html(html_path)
        
        # PNG estatico
        png_path = os.path.join(PLOTS_DIR, f"{name}.png")
        try:
            fig.write_image(png_path, width=1200, height=800, scale=2)
            print(f"✅ {name}: HTML + PNG guardados")
        except Exception as e:
            print(f"✅ {name}: HTML guardado (PNG requiere kaleido)")
    
    print("\n" + "="*70)
    print("VISUALIZACIONES COMPLETADAS")
    print("="*70)
    print(f"\n📂 Directorio: {PLOTS_DIR}")
    print(f"📊 {len(plots)} graficos generados")
    print("\nArchivos HTML para graficos interactivos")
    print("Archivos PNG para imagenes estaticas")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
