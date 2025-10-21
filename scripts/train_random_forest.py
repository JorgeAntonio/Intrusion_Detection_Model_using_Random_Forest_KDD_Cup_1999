import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score
from scipy.stats import randint


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSV_PATH = os.path.join(os.path.dirname(__file__), "KDD_TRAIN_FULL.csv")  # CSV está en scripts/
MODEL_OUT = os.path.join(BASE_DIR, "output", "rf_kdd_model.joblib")
METRICS_OUT = os.path.join(BASE_DIR, "output", "rf_kdd_metrics.txt")


def main():
    if not os.path.exists(CSV_PATH):
        raise SystemExit(f"CSV procesado no encontrado en: {CSV_PATH}\nEjecuta primero scripts/download_and_chunk.py")

    df = pd.read_csv(CSV_PATH)
    if "binario" not in df.columns:
        raise SystemExit("No se encontró la columna 'binario' en el CSV procesado.")

    X = df.drop(columns=["binario"])
    y = df["binario"]

    # Split estratificado
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # Estimador base con manejo de desbalance (reducir n_jobs para evitar problemas de memoria)
    clf = RandomForestClassifier(n_jobs=2, random_state=42, class_weight="balanced")

    # Búsqueda rápida de hiperparámetros (Randomized) - parámetros más conservadores
    param_dist = {
        "n_estimators": randint(50, 150),
        "max_depth": randint(10, 30),
        "min_samples_split": randint(2, 8),
        "min_samples_leaf": randint(1, 5),
        "max_features": ["sqrt", "log2"]
    }
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    rsearch = RandomizedSearchCV(clf, param_distributions=param_dist,
                                 n_iter=5, cv=cv, scoring="f1", n_jobs=1, verbose=1, random_state=42)

    print("Iniciando búsqueda de hiperparámetros y entrenamiento. Esto puede tomar varios minutos...")
    rsearch.fit(X_train, y_train)

    best = rsearch.best_estimator_

    # Evaluación en test
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
        f.write("Best params:\n")
        f.write(str(rsearch.best_params_) + "\n\n")
        f.write(f"Accuracy: {acc}\n")
        if roc_auc is not None:
            f.write(f"ROC AUC: {roc_auc}\n")
        f.write("Classification report:\n")
        f.write(report + "\n")
        f.write("Confusion matrix:\n")
        f.write(str(cm) + "\n")

    print("Entrenamiento completado.")
    print("Modelo guardado en:", MODEL_OUT)
    print("Métricas guardadas en:", METRICS_OUT)
    print("Resumen:\n", report)


if __name__ == "__main__":
    main()
