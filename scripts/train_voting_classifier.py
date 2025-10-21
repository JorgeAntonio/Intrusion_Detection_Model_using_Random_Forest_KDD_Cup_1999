import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import (
    VotingClassifier, 
    RandomForestClassifier, 
    GradientBoostingClassifier,
    AdaBoostClassifier
)
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSV_PATH = os.path.join(os.path.dirname(__file__), "KDD_TRAIN_FULL.csv")
MODEL_OUT = os.path.join(BASE_DIR, "output", "voting_classifier_kdd_model.joblib")
METRICS_OUT = os.path.join(BASE_DIR, "output", "voting_classifier_kdd_metrics.txt")


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

    print("\n" + "="*70)
    print("CREANDO VOTING CLASSIFIER (ENSEMBLE)")
    print("="*70)
    print("\nCombinando multiples modelos:")
    print("  1. Random Forest")
    print("  2. Gradient Boosting")
    print("  3. AdaBoost")
    print("  4. Logistic Regression")
    print()

    # Definir estimadores individuales con configuraciones optimizadas
    estimators = [
        ('rf', RandomForestClassifier(
            n_estimators=100,
            max_depth=16,
            min_samples_split=4,
            min_samples_leaf=1,
            max_features='log2',
            random_state=42,
            n_jobs=2,
            class_weight='balanced'
        )),
        ('gb', GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            min_samples_split=4,
            min_samples_leaf=2,
            subsample=0.8,
            random_state=42
        )),
        ('ada', AdaBoostClassifier(
            estimator=DecisionTreeClassifier(max_depth=3, random_state=42),
            n_estimators=100,
            learning_rate=0.5,
            random_state=42
        )),
        ('lr', LogisticRegression(
            max_iter=1000,
            random_state=42,
            n_jobs=2,
            class_weight='balanced'
        ))
    ]

    # Voting Classifier con votacion suave (soft voting)
    clf = VotingClassifier(
        estimators=estimators,
        voting='soft',
        n_jobs=2
    )

    print("Entrenando Voting Classifier...")
    print("Esto puede tomar varios minutos ya que entrena 4 modelos...\n")
    
    clf.fit(X_train, y_train)

    print("\n" + "="*70)
    print("Entrenamiento completado")
    print("="*70)

    # Evaluacion con validacion cruzada
    print("\nEvaluando con validacion cruzada (3-fold)...")
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    cv_scores = cross_val_score(clf, X_train, y_train, cv=cv, scoring='f1', n_jobs=2)
    print(f"F1-Score (CV): {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

    # Evaluacion en test
    print("\nEvaluando en conjunto de prueba...")
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, digits=4)
    cm = confusion_matrix(y_test, y_pred)

    roc_auc = None
    if hasattr(clf, "predict_proba") and len(set(y_test)) > 1:
        try:
            roc_auc = roc_auc_score(y_test, clf.predict_proba(X_test)[:, 1])
        except Exception:
            roc_auc = None

    # Guardar modelo y metricas
    os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)
    joblib.dump(clf, MODEL_OUT)

    with open(METRICS_OUT, "w", encoding="utf-8") as f:
        f.write("="*70 + "\n")
        f.write("VOTING CLASSIFIER (ENSEMBLE) - RESULTADOS\n")
        f.write("="*70 + "\n\n")
        f.write("Modelos combinados:\n")
        f.write("  - Random Forest\n")
        f.write("  - Gradient Boosting\n")
        f.write("  - AdaBoost\n")
        f.write("  - Logistic Regression\n\n")
        f.write(f"Voting strategy: soft (probabilidades)\n\n")
        f.write(f"F1-Score (CV): {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})\n\n")
        f.write(f"Accuracy: {acc:.6f}\n")
        if roc_auc is not None:
            f.write(f"ROC AUC: {roc_auc:.6f}\n")
        f.write("\nClassification report:\n")
        f.write(report + "\n")
        f.write("\nConfusion matrix:\n")
        f.write(str(cm) + "\n")

    print("\n" + "="*70)
    print("RESULTADOS FINALES")
    print("="*70)
    print(f"Accuracy: {acc:.4f}")
    if roc_auc is not None:
        print(f"ROC-AUC: {roc_auc:.4f}")
    print(f"\nModelo guardado en: {MODEL_OUT}")
    print(f"Metricas guardadas en: {METRICS_OUT}")
    print("\nClassification Report:")
    print(report)
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
