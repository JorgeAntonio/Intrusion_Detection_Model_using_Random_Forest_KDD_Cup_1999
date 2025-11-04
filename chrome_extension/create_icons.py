"""
Script para generar iconos de la extensión de Chrome
Ejecuta: python create_icons.py
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("⚠️  Pillow no está instalado. Instalando...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont
    print("✅ Pillow instalado correctamente\n")

import os

def create_icon(size, filename):
    """Crear un icono con diseño de red/seguridad"""
    
    # Crear imagen con fondo transparente
    img = Image.new('RGBA', (size, size), color=(0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colores del gradiente (azul/púrpura)
    color1 = (102, 126, 234)  # #667eea
    color2 = (118, 75, 162)   # #764ba2
    
    # Dibujar círculo de fondo con gradiente
    center = size // 2
    max_radius = size // 2 - 2
    
    for i in range(max_radius, 0, -1):
        # Interpolar color
        ratio = i / max_radius
        r = int(color1[0] * ratio + color2[0] * (1 - ratio))
        g = int(color1[1] * ratio + color2[1] * (1 - ratio))
        b = int(color1[2] * ratio + color2[2] * (1 - ratio))
        
        draw.ellipse(
            [center - i, center - i, center + i, center + i],
            fill=(r, g, b, 255)
        )
    
    # Dibujar icono de red (nodos conectados)
    if size >= 48:
        # Tamaño de nodos según el tamaño del icono
        node_size = max(2, size // 16)
        line_width = max(1, size // 32)
        
        # Posiciones de los nodos (relativas al tamaño)
        nodes = [
            (center, center - size // 4),           # Top
            (center - size // 4, center),           # Left
            (center + size // 4, center),           # Right
            (center - size // 6, center + size // 4),  # Bottom left
            (center + size // 6, center + size // 4),  # Bottom right
        ]
        
        # Dibujar conexiones
        connections = [
            (0, 1), (0, 2),  # Top to sides
            (1, 3), (2, 4),  # Sides to bottom
            (3, 4),          # Bottom nodes
        ]
        
        for start, end in connections:
            draw.line(
                [nodes[start], nodes[end]],
                fill=(255, 255, 255, 200),
                width=line_width
            )
        
        # Dibujar nodos
        for x, y in nodes:
            draw.ellipse(
                [x - node_size, y - node_size, x + node_size, y + node_size],
                fill=(255, 255, 255, 255)
            )
    else:
        # Para iconos pequeños, dibujar un símbolo simple
        # Dibujar un escudo simple
        shield_width = size // 2
        shield_height = size // 2
        left = center - shield_width // 2
        top = center - shield_height // 2
        
        draw.polygon(
            [
                (center, top),
                (left + shield_width, top),
                (left + shield_width, top + shield_height // 2),
                (center, top + shield_height),
                (left, top + shield_height // 2),
                (left, top)
            ],
            fill=(255, 255, 255, 255)
        )
    
    # Guardar
    os.makedirs('icons', exist_ok=True)
    img.save(f'icons/{filename}', 'PNG')
    print(f'✅ Creado: icons/{filename} ({size}x{size})')

def main():
    print("="*50)
    print("🎨 Generador de Iconos - Chrome Extension")
    print("="*50)
    print()
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists('manifest.json'):
        print("⚠️  Advertencia: No se encontró manifest.json")
        print("   Asegúrate de ejecutar este script desde la carpeta chrome_extension/")
        print()
    
    # Crear iconos
    sizes = [
        (16, 'icon16.png'),
        (48, 'icon48.png'),
        (128, 'icon128.png')
    ]
    
    for size, filename in sizes:
        create_icon(size, filename)
    
    print()
    print("="*50)
    print("✨ ¡Iconos creados exitosamente!")
    print("="*50)
    print()
    print("📁 Ubicación: chrome_extension/icons/")
    print()
    print("Próximos pasos:")
    print("1. Verifica los iconos en la carpeta icons/")
    print("2. Carga la extensión en Chrome (chrome://extensions/)")
    print("3. Activa 'Modo de desarrollador'")
    print("4. Click en 'Cargar extensión sin empaquetar'")
    print("5. Selecciona la carpeta chrome_extension")
    print()
    print("📚 Más información: INSTALACION.md")
    print()

if __name__ == '__main__':
    main()
