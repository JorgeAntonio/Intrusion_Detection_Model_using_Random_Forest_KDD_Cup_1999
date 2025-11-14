"""
Script de Simulación de Ataques - Para Probar la Extensión de Chrome
Simula ataques DDoS y Fuerza Bruta contra localhost:3000

IMPORTANTE: Solo usar en tu propio servidor local para pruebas
"""

import requests
import time
import threading
from datetime import datetime

# Configuración
TARGET_URL = "http://localhost:3000"
COLORS = {
    'RED': '\033[91m',
    'GREEN': '\033[92m',
    'YELLOW': '\033[93m',
    'BLUE': '\033[94m',
    'RESET': '\033[0m'
}

def print_header():
    """Mostrar header del script"""
    print("\n" + "="*70)
    print(f"{COLORS['RED']}⚠️  SIMULADOR DE ATAQUES - SOLO PARA PRUEBAS{COLORS['RESET']}")
    print("="*70)
    print(f"Target: {COLORS['BLUE']}{TARGET_URL}{COLORS['RESET']}")
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")

def print_info(message, color='RESET'):
    """Imprimir mensaje con color"""
    print(f"{COLORS[color]}{message}{COLORS['RESET']}")

def simulate_ddos(duration=10, requests_per_second=20):
    """
    Simular ataque DDoS
    
    Args:
        duration: Duración del ataque en segundos
        requests_per_second: Número de peticiones por segundo
    """
    print_info("\n[1] Iniciando simulación de ataque DDoS...", 'RED')
    print_info(f"    Duración: {duration} segundos", 'YELLOW')
    print_info(f"    Peticiones/segundo: {requests_per_second}", 'YELLOW')
    print_info(f"    Total de peticiones: {duration * requests_per_second}", 'YELLOW')
    
    start_time = time.time()
    request_count = 0
    success_count = 0
    error_count = 0
    
    def make_request():
        nonlocal request_count, success_count, error_count
        try:
            response = requests.get(TARGET_URL, timeout=2)
            request_count += 1
            if response.status_code == 200:
                success_count += 1
            print(f"    [{request_count}] Status: {response.status_code}", end='\r')
        except Exception as e:
            error_count += 1
            print(f"    [{request_count}] Error: {str(e)[:30]}", end='\r')
    
    print_info("\n    Enviando peticiones...", 'YELLOW')
    
    while time.time() - start_time < duration:
        threads = []
        for _ in range(requests_per_second):
            thread = threading.Thread(target=make_request)
            thread.start()
            threads.append(thread)
        
        # Esperar a que terminen los threads
        for thread in threads:
            thread.join()
        
        # Esperar hasta el siguiente segundo
        time.sleep(max(0, 1 - (time.time() - start_time) % 1))
    
    print_info(f"\n\n    ✓ Ataque DDoS completado!", 'GREEN')
    print_info(f"    Total de peticiones: {request_count}", 'BLUE')
    print_info(f"    Exitosas: {success_count}", 'GREEN')
    print_info(f"    Errores: {error_count}", 'RED')
    print_info(f"\n    🔍 Verifica la extensión de Chrome - Deberías ver una alerta de DDoS!", 'YELLOW')

def simulate_brute_force(attempts=15, delay=0.5):
    """
    Simular ataque de Fuerza Bruta
    
    Args:
        attempts: Número de intentos de login
        delay: Delay entre intentos en segundos
    """
    print_info("\n[2] Iniciando simulación de ataque de Fuerza Bruta...", 'RED')
    print_info(f"    Intentos: {attempts}", 'YELLOW')
    print_info(f"    Delay: {delay}s entre intentos", 'YELLOW')
    
    # Endpoints comunes de autenticación
    auth_endpoints = [
        f"{TARGET_URL}/api/login",
        f"{TARGET_URL}/api/auth",
        f"{TARGET_URL}/login",
        f"{TARGET_URL}/signin"
    ]
    
    # Credenciales de prueba
    credentials = [
        {"username": "admin", "password": "admin123"},
        {"username": "admin", "password": "password"},
        {"username": "root", "password": "root123"},
        {"username": "admin", "password": "12345"},
        {"username": "user", "password": "user123"},
    ]
    
    success_count = 0
    failed_count = 0
    
    print_info("\n    Intentando autenticación...", 'YELLOW')
    
    for i in range(attempts):
        endpoint = auth_endpoints[i % len(auth_endpoints)]
        creds = credentials[i % len(credentials)]
        
        try:
            # Intentar POST (aunque falle, la extensión detectará el patrón)
            response = requests.post(
                endpoint,
                json=creds,
                timeout=2,
                allow_redirects=False
            )
            
            print(f"    [{i+1}/{attempts}] {endpoint} - Status: {response.status_code}")
            
            if response.status_code in [401, 403]:
                failed_count += 1
            else:
                success_count += 1
                
        except requests.exceptions.ConnectionError:
            print(f"    [{i+1}/{attempts}] {endpoint} - Endpoint no existe (esperado)")
            failed_count += 1
        except Exception as e:
            print(f"    [{i+1}/{attempts}] Error: {str(e)[:50]}")
            failed_count += 1
        
        time.sleep(delay)
    
    print_info(f"\n    ✓ Ataque de Fuerza Bruta completado!", 'GREEN')
    print_info(f"    Total de intentos: {attempts}", 'BLUE')
    print_info(f"    Fallidos (401/403): {failed_count}", 'RED')
    print_info(f"\n    🔍 Verifica la extensión - Deberías ver intentos de Brute Force!", 'YELLOW')

def simulate_suspicious_patterns():
    """
    Simular acceso a rutas sospechosas
    """
    print_info("\n[3] Iniciando simulación de patrones sospechosos...", 'RED')
    
    suspicious_paths = [
        "/admin",
        "/wp-admin",
        "/phpmyadmin",
        "/.env",
        "/.git",
        "/config.php",
        "/admin/login",
        "/administrator",
        "/admin/config",
        "/backup.sql"
    ]
    
    print_info(f"    Accediendo a {len(suspicious_paths)} rutas sospechosas...", 'YELLOW')
    
    for i, path in enumerate(suspicious_paths, 1):
        try:
            url = f"{TARGET_URL}{path}"
            response = requests.get(url, timeout=2)
            print(f"    [{i}/{len(suspicious_paths)}] {path} - Status: {response.status_code}")
        except Exception as e:
            print(f"    [{i}/{len(suspicious_paths)}] {path} - Error (esperado)")
        
        time.sleep(0.3)
    
    print_info(f"\n    ✓ Patrones sospechosos completados!", 'GREEN')
    print_info(f"\n    🔍 Verifica la extensión - Deberías ver actividad sospechosa!", 'YELLOW')

def simulate_mixed_attack():
    """
    Simular ataque mixto (DDoS + Brute Force + Suspicious)
    """
    print_info("\n[4] Iniciando simulación de ATAQUE MIXTO...", 'RED')
    print_info("    Este ataque combina DDoS, Brute Force y patrones sospechosos", 'YELLOW')
    
    # DDoS corto
    print_info("\n    Fase 1: DDoS rápido (5 segundos)...", 'YELLOW')
    simulate_ddos(duration=5, requests_per_second=30)
    
    time.sleep(2)
    
    # Patrones sospechosos
    print_info("\n    Fase 2: Escaneo de rutas sospechosas...", 'YELLOW')
    simulate_suspicious_patterns()
    
    time.sleep(2)
    
    # Brute Force
    print_info("\n    Fase 3: Intentos de Brute Force...", 'YELLOW')
    simulate_brute_force(attempts=12, delay=0.3)
    
    print_info(f"\n    ✓ Ataque mixto completado!", 'GREEN')
    print_info(f"\n    🔍 Verifica la extensión - Deberías ver múltiples tipos de ataques!", 'YELLOW')

def menu():
    """Mostrar menú de opciones"""
    print_info("\nSelecciona el tipo de ataque a simular:", 'BLUE')
    print("1. DDoS (Distributed Denial of Service)")
    print("2. Brute Force (Fuerza Bruta)")
    print("3. Suspicious Patterns (Patrones Sospechosos)")
    print("4. Mixed Attack (Ataque Mixto)")
    print("5. Ataque Personalizado")
    print("0. Salir")
    
    return input("\nOpción: ").strip()

def custom_attack():
    """Configurar ataque personalizado"""
    print_info("\n[5] Configurar Ataque Personalizado", 'BLUE')
    
    print("\nTipo de ataque:")
    print("1. DDoS")
    print("2. Brute Force")
    attack_type = input("Selecciona (1 o 2): ").strip()
    
    if attack_type == "1":
        duration = int(input("Duración (segundos): ") or "10")
        rps = int(input("Peticiones por segundo: ") or "20")
        simulate_ddos(duration, rps)
    elif attack_type == "2":
        attempts = int(input("Número de intentos: ") or "15")
        delay = float(input("Delay entre intentos (segundos): ") or "0.5")
        simulate_brute_force(attempts, delay)

def main():
    """Función principal"""
    print_header()
    
    # Verificar que el servidor esté corriendo
    print_info("Verificando servidor...", 'YELLOW')
    try:
        response = requests.get(TARGET_URL, timeout=5)
        print_info(f"✓ Servidor detectado en {TARGET_URL}", 'GREEN')
        print_info(f"  Status: {response.status_code}", 'BLUE')
    except Exception as e:
        print_info(f"✗ Error: No se puede conectar a {TARGET_URL}", 'RED')
        print_info(f"  Asegúrate de que el servidor esté ejecutándose", 'YELLOW')
        print_info(f"  Error: {str(e)}", 'RED')
        return
    
    # Verificar extensión
    print_info("\n⚠️  IMPORTANTE:", 'YELLOW')
    print_info("1. Asegúrate de que la extensión de Chrome esté instalada y activa", 'YELLOW')
    print_info("2. Abre el popup de la extensión ANTES de ejecutar los ataques", 'YELLOW')
    print_info("3. Mantén el popup abierto para ver las detecciones en tiempo real", 'YELLOW')
    
    input("\nPresiona ENTER cuando estés listo...")
    
    while True:
        choice = menu()
        
        if choice == "0":
            print_info("\n¡Hasta luego!", 'GREEN')
            break
        elif choice == "1":
            simulate_ddos()
        elif choice == "2":
            simulate_brute_force()
        elif choice == "3":
            simulate_suspicious_patterns()
        elif choice == "4":
            simulate_mixed_attack()
        elif choice == "5":
            custom_attack()
        else:
            print_info("\nOpción inválida", 'RED')
        
        print("\n" + "-"*70)
        input("\nPresiona ENTER para continuar...")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print_info("\n\n✗ Ataque interrumpido por el usuario", 'YELLOW')
    except Exception as e:
        print_info(f"\n✗ Error: {str(e)}", 'RED')
        import traceback
        traceback.print_exc()
