"""
Script maestro para entrenar todos los modelos de ML
Ejecuta el entrenamiento de todos los modelos secuencialmente
"""
import os
import sys
import subprocess
import time


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCRIPTS_DIR = os.path.dirname(__file__)


def run_script(script_name, description):
    """Ejecuta un script de Python y muestra el progreso."""
    print("\n" + "="*80)
    print(f"🚀 {description}")
    print("="*80)
    
    script_path = os.path.join(SCRIPTS_DIR, script_name)
    
    if not os.path.exists(script_path):
        print(f"❌ Error: Script no encontrado: {script_path}")
        return False
    
    start_time = time.time()
    
    try:
        result = subprocess.run(
            [sys.executable, script_path],
            cwd=BASE_DIR,
            capture_output=False,
            text=True
        )
        
        elapsed = time.time() - start_time
        
        if result.returncode == 0:
            print(f"\n✅ {description} completado en {elapsed:.2f} segundos")
            return True
        else:
            print(f"\n❌ {description} fallo con codigo {result.returncode}")
            return False
            
    except Exception as e:
        print(f"\n❌ Error ejecutando {script_name}: {e}")
        return False


def main():
    print("="*80)
    print("ENTRENAMIENTO COMPLETO DE MODELOS DE ML")
    print("Dataset: KDD Cup 1999 - Deteccion de Intrusiones")
    print("="*80)
    print("\nEste script entrenara los siguientes modelos:")
    print("  1. Random Forest")
    print("  2. AdaBoost")
    print("  3. Gradient Boosting Machine")
    print("  4. Voting Classifier (Ensemble)")
    print("\nTiempo estimado total: 30-60 minutos")
    
    input("\nPresiona ENTER para comenzar...")
    
    start_total = time.time()
    
    # Lista de scripts a ejecutar
    training_scripts = [
        ("train_random_forest.py", "Entrenando Random Forest"),
        ("train_adaboost.py", "Entrenando AdaBoost"),
        ("train_gradient_boosting.py", "Entrenando Gradient Boosting Machine"),
        ("train_voting_classifier.py", "Entrenando Voting Classifier"),
    ]
    
    results = {}
    
    # Ejecutar cada script
    for script, description in training_scripts:
        success = run_script(script, description)
        results[description] = success
        
        if not success:
            print(f"\n⚠️  Advertencia: {description} fallo")
            response = input("¿Deseas continuar con los siguientes modelos? (s/n): ")
            if response.lower() != 's':
                print("\n❌ Entrenamiento cancelado por el usuario")
                return
    
    # Ejecutar comparacion
    print("\n" + "="*80)
    print("COMPARANDO MODELOS")
    print("="*80)
    run_script("compare_models.py", "Comparacion de Modelos")
    
    # Ejecutar visualizaciones
    print("\n" + "="*80)
    print("GENERANDO VISUALIZACIONES")
    print("="*80)
    run_script("visualize_comparison.py", "Visualizaciones Comparativas")
    
    # Resumen final
    total_time = time.time() - start_total
    
    print("\n" + "="*80)
    print("RESUMEN FINAL")
    print("="*80)
    
    successful = sum(1 for v in results.values() if v)
    total = len(results)
    
    print(f"\nModelos entrenados exitosamente: {successful}/{total}")
    print(f"Tiempo total: {total_time/60:.2f} minutos\n")
    
    for description, success in results.items():
        status = "✅" if success else "❌"
        print(f"{status} {description}")
    
    print("\n" + "="*80)
    print("ARCHIVOS GENERADOS")
    print("="*80)
    print("\nModelos guardados en: output/")
    print("  - rf_kdd_model.joblib")
    print("  - adaboost_kdd_model.joblib")
    print("  - gradient_boosting_kdd_model.joblib")
    print("  - voting_classifier_kdd_model.joblib")
    
    print("\nMetricas guardadas en: output/")
    print("  - rf_kdd_metrics.txt")
    print("  - adaboost_kdd_metrics.txt")
    print("  - gradient_boosting_kdd_metrics.txt")
    print("  - voting_classifier_kdd_metrics.txt")
    print("  - models_comparison.txt")
    print("  - models_comparison.csv")
    
    print("\nVisualizaciones en: output/comparison_plots/")
    print("  - metrics_comparison.html/png")
    print("  - errors_comparison.html/png")
    print("  - performance_radar.html/png")
    print("  - ranking_table.html/png")
    print("  - Y mas...")
    
    print("\n" + "="*80)
    print("🎉 PROCESO COMPLETADO")
    print("="*80 + "\n")


if __name__ == "__main__":
    main()
