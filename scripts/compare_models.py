import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, confusion_matrix, classification_report
)
import time


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSV_PATH = os.path.join(os.path.dirname(__file__), "KDD_TRAIN_FULL.csv")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
COMPARISON_OUT = os.path.join(OUTPUT_DIR, "models_comparison.txt")
COMPARISON_CSV = os.path.join(OUTPUT_DIR, "models_comparison.csv")


def load_model(model_path):
    """Carga un modelo guardado."""
    if os.path.exists(model_path):
        return joblib.load(model_path)
    return None


def evaluate_model(model, X_test, y_test, model_name):
    """Evalua un modelo y retorna metricas."""
    print(f"\nEvaluando {model_name}...")
    
    start_time = time.time()
    y_pred = model.predict(X_test)
    prediction_time = time.time() - start_time
    
    # Calcular metricas
    metrics = {
        'Model': model_name,
        'Accuracy': accuracy_score(y_test, y_pred),
        'Precision': precision_score(y_test, y_pred),
        'Recall': recall_score(y_test, y_pred),
        'F1-Score': f1_score(y_test, y_pred),
        'Prediction_Time': prediction_time
    }
    
    # ROC-AUC si el modelo soporta predict_proba
    if hasattr(model, 'predict_proba'):
        try:
            y_proba = model.predict_proba(X_test)[:, 1]
            metrics['ROC-AUC'] = roc_auc_score(y_test, y_proba)
        except:
            metrics['ROC-AUC'] = None
    else:
        metrics['ROC-AUC'] = None
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    metrics['True_Negatives'] = cm[0, 0]
    metrics['False_Positives'] = cm[0, 1]
    metrics['False_Negatives'] = cm[1, 0]
    metrics['True_Positives'] = cm[1, 1]
    
    # Calcular tasas de error
    total = len(y_test)
    metrics['Error_Rate'] = (metrics['False_Positives'] + metrics['False_Negatives']) / total
    metrics['FP_Rate'] = metrics['False_Positives'] / (metrics['False_Positives'] + metrics['True_Negatives'])
    metrics['FN_Rate'] = metrics['False_Negatives'] / (metrics['False_Negatives'] + metrics['True_Positives'])
    
    print(f"  Accuracy: {metrics['Accuracy']:.4f}")
    print(f"  F1-Score: {metrics['F1-Score']:.4f}")
    print(f"  ROC-AUC: {metrics['ROC-AUC']:.4f}" if metrics['ROC-AUC'] else "  ROC-AUC: N/A")
    
    return metrics


def main():
    print("="*80)
    print("COMPARACION DE MODELOS DE MACHINE LEARNING")
    print("Dataset: KDD Cup 1999 - Deteccion de Intrusiones")
    print("="*80)
    
    # Cargar datos
    print("\nCargando datos...")
    if not os.path.exists(CSV_PATH):
        raise SystemExit(f"CSV no encontrado: {CSV_PATH}")
    
    df = pd.read_csv(CSV_PATH)
    X = df.drop(columns=["binario"])
    y = df["binario"]
    
    # Usar la misma division que en el entrenamiento
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print(f"Datos de prueba: {len(X_test)} muestras")
    print(f"  - Normal: {sum(y_test == 0)}")
    print(f"  - Attack: {sum(y_test == 1)}")
    
    # Definir modelos a comparar
    models_info = [
        {
            'name': 'Random Forest',
            'path': os.path.join(OUTPUT_DIR, 'rf_kdd_model.joblib'),
            'short_name': 'RF'
        },
        {
            'name': 'AdaBoost',
            'path': os.path.join(OUTPUT_DIR, 'adaboost_kdd_model.joblib'),
            'short_name': 'ADA'
        },
        {
            'name': 'Gradient Boosting',
            'path': os.path.join(OUTPUT_DIR, 'gradient_boosting_kdd_model.joblib'),
            'short_name': 'GBM'
        },
        {
            'name': 'Voting Classifier',
            'path': os.path.join(OUTPUT_DIR, 'voting_classifier_kdd_model.joblib'),
            'short_name': 'VC'
        }
    ]
    
    # Evaluar cada modelo
    results = []
    print("\n" + "="*80)
    print("EVALUANDO MODELOS")
    print("="*80)
    
    for model_info in models_info:
        model = load_model(model_info['path'])
        if model is not None:
            metrics = evaluate_model(model, X_test, y_test, model_info['name'])
            results.append(metrics)
        else:
            print(f"\n⚠️  {model_info['name']}: Modelo no encontrado en {model_info['path']}")
            print(f"   Ejecuta: python scripts/train_{model_info['short_name'].lower()}.py")
    
    if not results:
        print("\n❌ No se encontraron modelos entrenados.")
        print("Ejecuta primero los scripts de entrenamiento.")
        return
    
    # Crear DataFrame con resultados
    df_results = pd.DataFrame(results)
    
    # Ordenar por F1-Score
    df_results = df_results.sort_values('F1-Score', ascending=False)
    
    # Guardar resultados en CSV
    df_results.to_csv(COMPARISON_CSV, index=False)
    
    # Generar reporte de texto
    print("\n" + "="*80)
    print("RESULTADOS DE LA COMPARACION")
    print("="*80)
    
    with open(COMPARISON_OUT, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("COMPARACION DE MODELOS - DETECCION DE INTRUSIONES KDD\n")
        f.write("="*80 + "\n\n")
        
        # Tabla de metricas principales
        f.write("METRICAS PRINCIPALES\n")
        f.write("-"*80 + "\n\n")
        
        header = f"{'Modelo':<20} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1-Score':>10} {'ROC-AUC':>10}\n"
        f.write(header)
        f.write("-"*80 + "\n")
        print("\n" + header)
        print("-"*80)
        
        for _, row in df_results.iterrows():
            roc_str = f"{row['ROC-AUC']:.4f}" if row['ROC-AUC'] is not None else "N/A"
            line = f"{row['Model']:<20} {row['Accuracy']:>10.4f} {row['Precision']:>10.4f} {row['Recall']:>10.4f} {row['F1-Score']:>10.4f} {roc_str:>10}\n"
            f.write(line)
            print(line.rstrip())
        
        f.write("\n\n")
        print()
        
        # Tabla de errores
        f.write("ANALISIS DE ERRORES\n")
        f.write("-"*80 + "\n\n")
        
        header2 = f"{'Modelo':<20} {'FP':>8} {'FN':>8} {'Total Err':>10} {'Error Rate':>12} {'FP Rate':>10} {'FN Rate':>10}\n"
        f.write(header2)
        f.write("-"*80 + "\n")
        print(header2)
        print("-"*80)
        
        for _, row in df_results.iterrows():
            total_err = row['False_Positives'] + row['False_Negatives']
            line = f"{row['Model']:<20} {row['False_Positives']:>8.0f} {row['False_Negatives']:>8.0f} {total_err:>10.0f} {row['Error_Rate']:>12.4f} {row['FP_Rate']:>10.4f} {row['FN_Rate']:>10.4f}\n"
            f.write(line)
            print(line.rstrip())
        
        f.write("\n\n")
        print()
        
        # Tiempos de prediccion
        f.write("TIEMPOS DE PREDICCION\n")
        f.write("-"*80 + "\n\n")
        
        header3 = f"{'Modelo':<20} {'Tiempo (s)':>15} {'Muestras/seg':>15}\n"
        f.write(header3)
        f.write("-"*80 + "\n")
        print(header3)
        print("-"*80)
        
        for _, row in df_results.iterrows():
            samples_per_sec = len(X_test) / row['Prediction_Time']
            line = f"{row['Model']:<20} {row['Prediction_Time']:>15.4f} {samples_per_sec:>15.2f}\n"
            f.write(line)
            print(line.rstrip())
        
        # Ranking y recomendaciones
        f.write("\n\n")
        f.write("="*80 + "\n")
        f.write("RANKING DE MODELOS (por F1-Score)\n")
        f.write("="*80 + "\n\n")
        
        print("\n" + "="*80)
        print("RANKING DE MODELOS (por F1-Score)")
        print("="*80 + "\n")
        
        for idx, (_, row) in enumerate(df_results.iterrows(), 1):
            medal = "🥇" if idx == 1 else "🥈" if idx == 2 else "🥉" if idx == 3 else f"{idx}."
            line = f"{medal} {row['Model']}: F1-Score = {row['F1-Score']:.6f}\n"
            f.write(f"{idx}. {row['Model']}: F1-Score = {row['F1-Score']:.6f}\n")
            print(line.rstrip())
        
        # Mejor modelo
        best_model = df_results.iloc[0]
        f.write("\n\n")
        f.write("="*80 + "\n")
        f.write("MEJOR MODELO\n")
        f.write("="*80 + "\n\n")
        f.write(f"Modelo: {best_model['Model']}\n")
        f.write(f"F1-Score: {best_model['F1-Score']:.6f}\n")
        f.write(f"Accuracy: {best_model['Accuracy']:.6f}\n")
        f.write(f"ROC-AUC: {best_model['ROC-AUC']:.6f}\n" if best_model['ROC-AUC'] else "")
        f.write(f"Errores totales: {int(best_model['False_Positives'] + best_model['False_Negatives'])}\n")
        
        print("\n" + "="*80)
        print("MEJOR MODELO")
        print("="*80)
        print(f"\n🏆 {best_model['Model']}")
        print(f"   F1-Score: {best_model['F1-Score']:.6f}")
        print(f"   Accuracy: {best_model['Accuracy']:.6f}")
        if best_model['ROC-AUC']:
            print(f"   ROC-AUC: {best_model['ROC-AUC']:.6f}")
        print(f"   Errores totales: {int(best_model['False_Positives'] + best_model['False_Negatives'])}")
    
    print("\n" + "="*80)
    print("ARCHIVOS GENERADOS")
    print("="*80)
    print(f"📄 Reporte detallado: {COMPARISON_OUT}")
    print(f"📊 Datos CSV: {COMPARISON_CSV}")
    print("="*80 + "\n")


if __name__ == "__main__":
    main()
