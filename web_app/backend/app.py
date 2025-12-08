import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    roc_curve,
    auc,
    precision_recall_curve,
    accuracy_score
)
import json

app = Flask(__name__)
CORS(app)

# Configuración de rutas
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODEL_PATH = os.path.join(BASE_DIR, "output", "gradient_boosting_kdd_model.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "output", "gradient_boosting_kdd_metrics.txt")
PLOTS_DIR = os.path.join(BASE_DIR, "output", "plots")

# Columnas originales del dataset KDD (crudo)
RAW_COLUMNS = [
    "duration","protocol_type","service","flag","src_bytes","dst_bytes","land","wrong_fragment",
    "urgent","hot","num_failed_logins","logged_in","num_compromised","root_shell","su_attempted",
    "num_root","num_file_creations","num_shells","num_access_files","num_outbound_cmds",
    "is_host_login","is_guest_login","count","srv_count","serror_rate","srv_serror_rate",
    "rerror_rate","srv_rerror_rate","same_srv_rate","diff_srv_rate","srv_diff_host_rate",
    "dst_host_count","dst_host_srv_count","dst_host_same_srv_rate","dst_host_diff_srv_rate",
    "dst_host_same_src_port_rate","dst_host_srv_diff_host_rate","dst_host_serror_rate",
    "dst_host_srv_serror_rate","dst_host_rerror_rate","dst_host_srv_rerror_rate","class","difficulty"
]

CATEGORICAL_COLUMNS = ["protocol_type", "service", "flag"]


# Cargar modelo al iniciar
print("Cargando modelo Gradient Boosting...")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Modelo no encontrado en: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)
print("Modelo cargado exitosamente")

MODEL_FEATURES = list(model.feature_names_in_) if hasattr(model, "feature_names_in_") else None

def preprocess_raw_file(file_obj):
    """Procesa un TXT crudo aplicando el mismo flujo usado en entrenamiento."""
    df = pd.read_csv(file_obj, header=None, names=RAW_COLUMNS, low_memory=False)
    return preprocess_raw_df(df)

def preprocess_raw_df(df):
    """Procesa un DataFrame crudo (txt/csv) aplicando el mismo flujo usado en entrenamiento."""
    df["binario"] = (df["class"] != "normal").astype(int)
    df = df.drop(columns=["class"], errors="ignore")
    df = pd.get_dummies(df, columns=CATEGORICAL_COLUMNS, dtype=int)
    return df

def align_features(df):
    """Alinea columnas al orden/espacio del modelo (rellena faltantes con 0, descarta extras)."""
    if MODEL_FEATURES is None:
        return df
    aligned = pd.DataFrame(0, index=df.index, columns=MODEL_FEATURES)
    for col in df.columns:
        if col in aligned.columns:
            aligned[col] = df[col]
    return aligned


@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar que el servidor está funcionando."""
    return jsonify({
        'status': 'ok',
        'model': 'Gradient Boosting Classifier',
        'model_path': MODEL_PATH
    })

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    """Obtener información del modelo entrenado."""
    try:
        # Leer métricas del archivo
        metrics_data = {}
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, 'r', encoding='utf-8') as f:
                content = f.read()
                metrics_data['raw_metrics'] = content
                
                # Extraer métricas específicas
                lines = content.split('\n')
                for line in lines:
                    if 'Accuracy:' in line:
                        metrics_data['accuracy'] = float(line.split(':')[1].strip())
                    elif 'ROC AUC:' in line:
                        metrics_data['roc_auc'] = float(line.split(':')[1].strip())
                    elif 'Best F1-Score (CV):' in line:
                        metrics_data['best_f1_cv'] = float(line.split(':')[1].strip())
        
        # Información del modelo
        model_info = {
            'model_type': 'Gradient Boosting Classifier',
            'n_estimators': model.n_estimators,
            'learning_rate': float(model.learning_rate),
            'max_depth': int(model.max_depth),
            'n_features': model.n_features_in_,
            'metrics': metrics_data
        }
        
        return jsonify(model_info)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Realizar predicciones sobre datos cargados."""
    try:
        # Verificar si se envió un archivo
        if 'file' not in request.files:
            return jsonify({'error': 'No se proporcionó ningún archivo'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Nombre de archivo vacío'}), 400
        
        extension = os.path.splitext(file.filename)[1].lower()

        # Seleccionar flujo según extensión/contenido
        if extension in ['.txt', '.data']:
            df = preprocess_raw_file(file)
        else:
            df = pd.read_csv(file)
            is_raw_csv = ('class' in df.columns) or all(col in df.columns for col in CATEGORICAL_COLUMNS)
            if is_raw_csv:
                df = preprocess_raw_df(df)
        
        # Verificar si tiene la columna 'binario' (etiquetas reales)
        has_labels = 'binario' in df.columns
        
        if has_labels:
            y_true = df['binario']
            X = df.drop(columns=['binario'])
        else:
            y_true = None
            X = df
        
        # Alinear columnas al modelo
        X_aligned = align_features(X)
        
        # Realizar predicciones
        y_pred = model.predict(X_aligned)
        y_proba = model.predict_proba(X_aligned)
        
        # Preparar respuesta
        response = {
            'total_samples': len(X),
            'predictions': y_pred.tolist(),
            'probabilities': y_proba.tolist(),
            'prediction_summary': {
                'normal': int(np.sum(y_pred == 0)),
                'attack': int(np.sum(y_pred == 1)),
                'normal_percentage': float(np.mean(y_pred == 0) * 100),
                'attack_percentage': float(np.mean(y_pred == 1) * 100)
            }
        }
        
        # Si hay etiquetas reales, calcular métricas
        if has_labels:
            y_true_array = y_true.values
            
            # Métricas básicas
            acc = accuracy_score(y_true_array, y_pred)
            cm = confusion_matrix(y_true_array, y_pred)
            report = classification_report(y_true_array, y_pred, output_dict=True)
            
            # ROC curve
            fpr, tpr, _ = roc_curve(y_true_array, y_proba[:, 1])
            roc_auc = auc(fpr, tpr)
            
            # Precision-Recall curve
            precision, recall, _ = precision_recall_curve(y_true_array, y_proba[:, 1])
            pr_auc = auc(recall, precision)
            
            response['evaluation'] = {
                'accuracy': float(acc),
                'confusion_matrix': cm.tolist(),
                'classification_report': report,
                'roc_curve': {
                    'fpr': fpr.tolist(),
                    'tpr': tpr.tolist(),
                    'auc': float(roc_auc)
                },
                'precision_recall_curve': {
                    'precision': precision.tolist(),
                    'recall': recall.tolist(),
                    'auc': float(pr_auc)
                }
            }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/feature-importance', methods=['GET'])
def get_feature_importance():
    """Obtener la importancia de características del modelo."""
    try:
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            
            # Crear lista de características con sus importancias
            feature_importance = [
                {'feature': f'feature_{i}', 'importance': float(imp)}
                for i, imp in enumerate(importances)
            ]
            
            # Ordenar por importancia
            feature_importance.sort(key=lambda x: x['importance'], reverse=True)
            
            return jsonify({
                'feature_importance': feature_importance[:20]  # Top 20
            })
        else:
            return jsonify({'error': 'El modelo no tiene feature_importances_'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plots', methods=['GET'])
def list_plots():
    """Listar los plots disponibles."""
    try:
        plots = []
        if os.path.exists(PLOTS_DIR):
            for filename in os.listdir(PLOTS_DIR):
                if filename.endswith('.html'):
                    plots.append({
                        'name': filename.replace('.html', '').replace('_', ' ').title(),
                        'filename': filename,
                        'path': os.path.join(PLOTS_DIR, filename)
                    })
        
        return jsonify({'plots': plots})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plot/<filename>', methods=['GET'])
def get_plot(filename):
    """Obtener el contenido HTML de un plot específico."""
    try:
        plot_path = os.path.join(PLOTS_DIR, filename)
        
        if not os.path.exists(plot_path):
            return jsonify({'error': 'Plot no encontrado'}), 404
        
        with open(plot_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return jsonify({'html': content})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*70)
    print("SERVIDOR FLASK - GRADIENT BOOSTING MODEL")
    print("="*70)
    print(f"Modelo: {MODEL_PATH}")
    print(f"Puerto: 5000")
    print("="*70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
