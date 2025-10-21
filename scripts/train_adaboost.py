import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV, StratifiedKFold
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score
from scipy.stats import randint, uniform


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSV_PATH = os.path.join(os.path.dirname(__file__), "KDD_TRAIN_FULL.csv")
MODEL_OUT = os.path.join(BASE_DIR, "output", "adaboost_kdd_model.joblib")
METRICS_OUT = os.path.join(BASE_DIR, "output", "adaboost_kdd_metrics.txt")


def main():
    if not os.path.exists(CSV_PATH):
        raise SystemExit(f"CSV procesado no encontrado en: {CSV_PATH}\nEjecuta primero scripts/download_and_chunk.py")

    print("Cargando datos...")
    df = pd.read_csv(CSV_PATH)
    if "binario" not in df.columns:
        raise SystemExit("No se encontró la columna 'binario' en el CSV procesado.")

    X = df.drop(columns=["binario"])
    y = df["binario"]

    # Split estratificado
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Datos cargados: {len(X_train)} train, {len(X_test)} test")

    # Estimador base: Decision Tree con profundidad limitada
    base_estimator = DecisionTreeClassifier(max_depth=3, random_state=42)
    
    # AdaBoost Classifier
    clf = AdaBoostClassifier(
        estimator=base_estimator,
        random_state=42
    )

    # Búsqueda de hiperparámetros
    param_dist = {
        "n_estimators": randint(50, 200),
        "learning_rate": uniform(0.01, 1.0),
    }
    
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    rsearch = RandomizedSearchCV(
        clf, 
        param_distributions=param_dist,
        n_iter=10, 
        cv=cv, 
        scoring="f1", 
        n_jobs=2, 
        verbose=2, 
        random_state=42
    )

    print("\n" + "="*70)
    print("🚀 ENTRENANDO ADABOOST CLASSIFIER")
    print("="*70)
    print("Iniciando búsqueda de hiperparámetros...")
    print("Esto puede tomar varios minutos...\n")
    
    rsearch.fit(X_train, y_train)

    best = rsearch.best_estimator_

    print("\n" + "="*70)
    print("✅ Entrenamiento completado")
    print("="*70)
    print(f"Mejores hiperparámetros: {rsearch.best_params_}")
    print(f"Mejor F1-Score (CV): {rsearch.best_score_:.4f}\n")

    # Evaluación en test
    print("Evaluando en conjunto de prueba...")
    y_pred = best.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, digits=4)
    cm = confusion_matrix(y_test, y_pred)

    roc_auc = None
    if hasattr(best, "predict_proba") and len(set(y_test)) > 1:
        try:
            roc_auc = roc_auc_score(y_test, best.predict_proba(X_test)[:, 1])
        except Exception:
            roc_auc = None

    # Guardar modelo y métricas
    os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)
    joblib.dump(best, MODEL_OUT)

    with open(METRICS_OUT, "w", encoding="utf-8") as f:
        f.write("="*70 + "\n")
        f.write("ADABOOST CLASSIFIER - RESULTADOS\n")
        f.write("="*70 + "\n\n")
        f.write("Best params:\n")
        f.write(str(rsearch.best_params_) + "\n\n")
        f.write(f"Best F1-Score (CV): {rsearch.best_score_:.4f}\n\n")
        f.write(f"Accuracy: {acc:.6f}\n")
        if roc_auc is not None:
            f.write(f"ROC AUC: {roc_auc:.6f}\n")
        f.write("\nClassification report:\n")
        f.write(report + "\n")
        f.write("\nConfusion matrix:\n")
        f.write(str(cm) + "\n")

    print("\n" + "="*70)
    print("📊 RESULTADOS FINALES")
    print("="*70)
    print(f"Accuracy: {acc:.4f}")
    if roc_auc is not None:
        print(f"ROC-AUC: {roc_auc:.4f}")
    print(f"\nModelo guardado en: {MODEL_OUT}")
    print(f"Métricas guardadas en: {METRICS_OUT}")
    print("\nClassification Report:")
    print(report)
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
