# Script Python pour compresser les images lourdes
# Necessaire: pip install Pillow

from PIL import Image
import os

images_to_compress = [
    "positive-female-housekeeper.jpg",
    "young-african-american-man-doing-laundry.jpg", 
    "open-laptop-with-stationeries-office-desk-office.jpg",
    "parter.jpg",
    "cleaning-equipments-arranged-row.jpg"
]

print("\n*** COMPRESSION DES IMAGES LOURDES ***\n")

total_saved = 0

for img_name in images_to_compress:
    img_path = f"images/{img_name}"
    
    if not os.path.exists(img_path):
        print(f"   Avertissement: {img_name} introuvable\n")
        continue
    
    # Taille originale
    original_size = os.path.getsize(img_path)
    original_mb = original_size / (1024 * 1024)
    
    print(f"Compression: {img_name} ({original_mb:.2f} MB)...")
    
    # Backup
    backup_path = f"{img_path}.backup"
    if not os.path.exists(backup_path):
        with open(img_path, 'rb') as f:
            with open(backup_path, 'wb') as backup:
                backup.write(f.read())
    
    # Ouvrir et redimensionner l'image
    with Image.open(img_path) as img:
        # Convertir RGBA en RGB si nécessaire
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        
        # Redimensionner si largeur > 1920px
        if img.width > 1920:
            ratio = 1920 / img.width
            new_height = int(img.height * ratio)
            img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
        
        # Sauvegarder avec qualité 80%
        img.save(img_path, 'JPEG', quality=80, optimize=True)
    
    # Nouvelle taille
    new_size = os.path.getsize(img_path)
    new_mb = new_size / (1024 * 1024)
    saved = original_size - new_size
    saved_mb = saved / (1024 * 1024)
    saved_percent = (saved / original_size) * 100
    
    total_saved += saved
    
    print(f"   SUCCES: {new_mb:.2f} MB (-{saved_mb:.2f} MB, -{saved_percent:.1f}%)\n")

total_saved_mb = total_saved / (1024 * 1024)
print(f"*** COMPRESSION TERMINEE ! ***\n")
print(f"   Espace economise: {total_saved_mb:.2f} MB\n")
print(f"   Les originaux sont sauvegardes (.backup)\n")
