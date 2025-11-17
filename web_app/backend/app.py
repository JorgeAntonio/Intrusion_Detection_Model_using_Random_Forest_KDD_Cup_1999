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
from datetime import datetime, timedelta
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# Configuración de rutas
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODEL_PATH = os.path.join(BASE_DIR, "output", "gradient_boosting_kdd_model.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "output", "gradient_boosting_kdd_metrics.txt")
PLOTS_DIR = os.path.join(BASE_DIR, "output", "plots")

# Cargar modelo al iniciar
print("Cargando modelo Gradient Boosting...")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Modelo no encontrado en: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)
print("Modelo cargado exitosamente")

# Obtener nombres de features del modelo
FEATURE_NAMES = [
    'duration', 'src_bytes', 'dst_bytes', 'land', 'wrong_fragment', 'urgent', 'hot',
    'num_failed_logins', 'logged_in', 'num_compromised', 'root_shell', 'su_attempted',
    'num_root', 'num_file_creations', 'num_shells', 'num_access_files', 'num_outbound_cmds',
    'is_host_login', 'is_guest_login', 'count', 'srv_count', 'serror_rate', 'srv_serror_rate',
    'rerror_rate', 'srv_rerror_rate', 'same_srv_rate', 'diff_srv_rate', 'srv_diff_host_rate',
    'dst_host_count', 'dst_host_srv_count', 'dst_host_same_srv_rate', 'dst_host_diff_srv_rate',
    'dst_host_same_src_port_rate', 'dst_host_srv_diff_host_rate', 'dst_host_serror_rate',
    'dst_host_srv_serror_rate', 'dst_host_rerror_rate', 'dst_host_srv_rerror_rate', 'difficulty'
]

# Agregar features one-hot encoded
PROTOCOL_TYPES = ['icmp', 'tcp', 'udp']
SERVICES = ['IRC', 'X11', 'Z39_50', 'aol', 'auth', 'bgp', 'courier', 'csnet_ns', 'ctf', 'daytime',
            'discard', 'domain', 'domain_u', 'echo', 'eco_i', 'ecr_i', 'efs', 'exec', 'finger',
            'ftp', 'ftp_data', 'gopher', 'harvest', 'hostnames', 'http', 'http_2784', 'http_443',
            'http_8001', 'imap4', 'iso_tsap', 'klogin', 'kshell', 'ldap', 'link', 'login', 'mtp',
            'name', 'netbios_dgm', 'netbios_ns', 'netbios_ssn', 'netstat', 'nnsp', 'nntp', 'ntp_u',
            'other', 'pm_dump', 'pop_2', 'pop_3', 'printer', 'private', 'red_i', 'remote_job', 'rje',
            'shell', 'smtp', 'sql_net', 'ssh', 'sunrpc', 'supdup', 'systat', 'telnet', 'tftp_u',
            'tim_i', 'time', 'urh_i', 'urp_i', 'uucp', 'uucp_path', 'vmnet', 'whois']
FLAGS = ['OTH', 'REJ', 'RSTO', 'RSTOS0', 'RSTR', 'S0', 'S1', 'S2', 'S3', 'SF', 'SH']

for protocol in PROTOCOL_TYPES:
    FEATURE_NAMES.append(f'protocol_type_{protocol}')
for service in SERVICES:
    FEATURE_NAMES.append(f'service_{service}')
for flag in FLAGS:
    FEATURE_NAMES.append(f'flag_{flag}')

print(f"Total features esperadas: {len(FEATURE_NAMES)}")


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
        
        # Leer el archivo CSV
        df = pd.read_csv(file)
        
        # Verificar si tiene la columna 'binario' (etiquetas reales)
        has_labels = 'binario' in df.columns
        
        if has_labels:
            y_true = df['binario']
            X = df.drop(columns=['binario'])
        else:
            y_true = None
            X = df
        
        # Realizar predicciones
        y_pred = model.predict(X)
        y_proba = model.predict_proba(X)
        
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


class HTTPToKDDAdapter:
    """Adaptador que convierte tráfico HTTP a features KDD para el modelo ML"""
    
    def __init__(self):
        self.traffic_history = defaultdict(list)
        self.connection_stats = defaultdict(lambda: {
            'count': 0,
            'srv_count': 0,
            'serror_count': 0,
            'rerror_count': 0,
            'same_srv_count': 0,
            'diff_srv_count': 0,
            'failed_logins': 0,
            'total_bytes_sent': 0,
            'total_bytes_received': 0,
            'services': set(),
            'last_service': None
        })
    
    def extract_features(self, traffic_data):
        """
        Convierte datos de tráfico HTTP a features KDD
        
        Args:
            traffic_data: Lista de requests HTTP con estructura:
                {
                    'url': str,
                    'method': str,
                    'statusCode': int,
                    'timestamp': int,
                    'duration': int (ms),
                    'requestSize': int (bytes),
                    'responseSize': int (bytes),
                    'domain': str
                }
        
        Returns:
            DataFrame con features en formato KDD
        """
        if not traffic_data:
            return None
        
        features_list = []
        
        for request in traffic_data:
            domain = request.get('domain', 'unknown')
            stats = self.connection_stats[domain]
            
            # Actualizar estadísticas
            stats['count'] += 1
            stats['total_bytes_sent'] += request.get('requestSize', 0)
            stats['total_bytes_received'] += request.get('responseSize', 0)
            
            # Detectar servicio basado en URL
            service = self._detect_service(request.get('url', ''))
            stats['services'].add(service)
            
            if stats['last_service'] == service:
                stats['same_srv_count'] += 1
            else:
                stats['diff_srv_count'] += 1
            stats['last_service'] = service
            
            # Detectar errores
            status_code = request.get('statusCode', 200)
            if status_code >= 500:
                stats['serror_count'] += 1
            elif status_code >= 400:
                stats['rerror_count'] += 1
                if status_code in [401, 403]:
                    stats['failed_logins'] += 1
            
            # Construir features KDD
            features = self._build_kdd_features(request, stats)
            features_list.append(features)
        
        # Crear DataFrame
        df = pd.DataFrame(features_list, columns=FEATURE_NAMES)
        return df
    
    def _detect_service(self, url):
        """Detecta el servicio basado en la URL"""
        url_lower = url.lower()
        
        if '/api/' in url_lower or 'api.' in url_lower:
            return 'http'
        elif 'ftp' in url_lower:
            return 'ftp'
        elif 'ssh' in url_lower:
            return 'ssh'
        elif 'telnet' in url_lower:
            return 'telnet'
        elif 'smtp' in url_lower or 'mail' in url_lower:
            return 'smtp'
        elif 'auth' in url_lower or 'login' in url_lower:
            return 'auth'
        elif 'domain' in url_lower or 'dns' in url_lower:
            return 'domain'
        else:
            return 'http'
    
    def _build_kdd_features(self, request, stats):
        """Construye el vector de features KDD"""
        features = {}
        
        # Features básicas
        features['duration'] = request.get('duration', 0) / 1000.0  # ms a segundos
        features['src_bytes'] = request.get('requestSize', 0)
        features['dst_bytes'] = request.get('responseSize', 0)
        features['land'] = 0  # No aplica en HTTP
        features['wrong_fragment'] = 0
        features['urgent'] = 0
        
        # Features de contenido
        url = request.get('url', '')
        features['hot'] = 1 if any(x in url.lower() for x in ['admin', 'root', 'password']) else 0
        features['num_failed_logins'] = stats['failed_logins']
        features['logged_in'] = 1 if request.get('statusCode', 200) == 200 else 0
        features['num_compromised'] = 0
        features['root_shell'] = 0
        features['su_attempted'] = 0
        features['num_root'] = 0
        features['num_file_creations'] = 0
        features['num_shells'] = 0
        features['num_access_files'] = 0
        features['num_outbound_cmds'] = 0
        features['is_host_login'] = 0
        features['is_guest_login'] = 0
        
        # Features de tráfico (últimos 2 segundos)
        features['count'] = stats['count']
        features['srv_count'] = len(stats['services'])
        
        # Tasas de error
        total = max(stats['count'], 1)
        features['serror_rate'] = stats['serror_count'] / total
        features['srv_serror_rate'] = stats['serror_count'] / total
        features['rerror_rate'] = stats['rerror_count'] / total
        features['srv_rerror_rate'] = stats['rerror_count'] / total
        
        # Tasas de servicio
        features['same_srv_rate'] = stats['same_srv_count'] / total
        features['diff_srv_rate'] = stats['diff_srv_count'] / total
        features['srv_diff_host_rate'] = 0.0
        
        # Features de host (simuladas)
        features['dst_host_count'] = min(stats['count'], 255)
        features['dst_host_srv_count'] = min(len(stats['services']), 255)
        features['dst_host_same_srv_rate'] = features['same_srv_rate']
        features['dst_host_diff_srv_rate'] = features['diff_srv_rate']
        features['dst_host_same_src_port_rate'] = 0.0
        features['dst_host_srv_diff_host_rate'] = 0.0
        features['dst_host_serror_rate'] = features['serror_rate']
        features['dst_host_srv_serror_rate'] = features['srv_serror_rate']
        features['dst_host_rerror_rate'] = features['rerror_rate']
        features['dst_host_srv_rerror_rate'] = features['srv_rerror_rate']
        features['difficulty'] = 0
        
        # Protocol type (HTTP = TCP)
        features['protocol_type_icmp'] = 0
        features['protocol_type_tcp'] = 1
        features['protocol_type_udp'] = 0
        
        # Service (detectar basado en URL)
        service = self._detect_service(request.get('url', ''))
        for s in SERVICES:
            features[f'service_{s}'] = 1 if s == service else 0
        
        # Flag (basado en status code)
        status_code = request.get('statusCode', 200)
        flag = self._get_flag(status_code)
        for f in FLAGS:
            features[f'flag_{f}'] = 1 if f == flag else 0
        
        return [features[name] for name in FEATURE_NAMES]
    
    def _get_flag(self, status_code):
        """Mapea status code HTTP a flag KDD"""
        if status_code == 200:
            return 'SF'  # Normal
        elif status_code == 404:
            return 'REJ'  # Rejected
        elif status_code in [401, 403]:
            return 'S0'  # Connection attempt rejected
        elif status_code >= 500:
            return 'S1'  # Connection established but rejected
        else:
            return 'SF'
    
    def clear_old_stats(self, max_age_seconds=300):
        """Limpia estadísticas antiguas (más de 5 minutos)"""
        # En producción, implementar limpieza basada en timestamp
        pass

# Instancia global del adaptador
adapter = HTTPToKDDAdapter()


@app.route('/api/predict-realtime', methods=['POST'])
def predict_realtime():
    """
    Predecir ataques en tiempo real desde tráfico HTTP capturado por la extensión.
    
    Espera JSON con estructura:
    {
        "traffic": [
            {
                "url": "http://example.com/api/login",
                "method": "POST",
                "statusCode": 401,
                "timestamp": 1234567890,
                "duration": 150,
                "requestSize": 256,
                "responseSize": 128,
                "domain": "example.com"
            }
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'traffic' not in data:
            return jsonify({'error': 'No se proporcionaron datos de tráfico'}), 400
        
        traffic_data = data['traffic']
        
        if not traffic_data or len(traffic_data) == 0:
            return jsonify({'error': 'Lista de tráfico vacía'}), 400
        
        # Convertir tráfico HTTP a features KDD
        features_df = adapter.extract_features(traffic_data)
        
        if features_df is None or len(features_df) == 0:
            return jsonify({'error': 'No se pudieron extraer features'}), 400
        
        # Realizar predicciones
        predictions = model.predict(features_df)
        probabilities = model.predict_proba(features_df)
        
        # Preparar respuesta
        results = []
        for i, (pred, proba) in enumerate(zip(predictions, probabilities)):
            results.append({
                'index': i,
                'url': traffic_data[i].get('url', 'unknown'),
                'prediction': 'attack' if pred == 1 else 'normal',
                'confidence': float(proba[pred]),
                'attack_probability': float(proba[1]),
                'normal_probability': float(proba[0])
            })
        
        # Estadísticas generales
        attack_count = int(np.sum(predictions == 1))
        normal_count = int(np.sum(predictions == 0))
        avg_attack_prob = float(np.mean(probabilities[:, 1]))
        
        response = {
            'total_requests': len(traffic_data),
            'predictions': results,
            'summary': {
                'attacks_detected': attack_count,
                'normal_traffic': normal_count,
                'attack_percentage': float(attack_count / len(traffic_data) * 100),
                'average_attack_probability': avg_attack_prob,
                'threat_level': 'high' if avg_attack_prob > 0.7 else 'medium' if avg_attack_prob > 0.3 else 'low'
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error en predict_realtime: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/export-kdd-features', methods=['POST'])
def export_kdd_features():
    """
    Exportar tráfico HTTP convertido a features KDD en formato CSV.
    Este CSV puede ser usado directamente con el modelo ML.
    """
    try:
        data = request.get_json()
        
        if not data or 'traffic' not in data:
            return jsonify({'error': 'No se proporcionaron datos de tráfico'}), 400
        
        traffic_data = data['traffic']
        
        if not traffic_data or len(traffic_data) == 0:
            return jsonify({'error': 'Lista de tráfico vacía'}), 400
        
        # Convertir tráfico HTTP a features KDD
        features_df = adapter.extract_features(traffic_data)
        
        if features_df is None or len(features_df) == 0:
            return jsonify({'error': 'No se pudieron extraer features'}), 400
        
        # Convertir DataFrame a CSV
        csv_data = features_df.to_csv(index=False)
        
        # Retornar como texto plano (CSV)
        return csv_data, 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': f'attachment; filename=traffic_kdd_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        }
    
    except Exception as e:
        print(f"Error en export_kdd_features: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*70)
    print("SERVIDOR FLASK - GRADIENT BOOSTING MODEL")
    print("="*70)
    print(f"Modelo: {MODEL_PATH}")
    print(f"Puerto: 5000")
    print("="*70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
