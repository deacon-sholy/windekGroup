from PIL import Image
import os

input_dir = r"c:\Users\dell\Downloads\windekGroup\windekGroup\img"
output_dir = input_dir  # save alongside originals

extensions_map = {
    '.jpg': 'JPEG',
    '.jpeg': 'JPEG',
    '.png': 'PNG',
}

files_to_convert = [
    'dorcas.jpg', 'Emma.jpg', 'joy.jpg', 'joyce.jpg', 'motun.jpg',
    'Windek Group Logo.png'
]

for fname in files_to_convert:
    src_path = os.path.join(input_dir, fname)
    if not os.path.exists(src_path):
        print(f"NOT FOUND: {src_path}")
        continue
    
    base, ext = os.path.splitext(fname)
    dst_name = base + '.webp'
    dst_path = os.path.join(output_dir, dst_name)
    
    img = Image.open(src_path)
    img = img.convert('RGB') if ext.lower() in ('.jpg', '.jpeg') else img.convert('RGBA')
    
    # Determine quality and save
    if ext.lower() in ('.jpg', '.jpeg'):
        img.save(dst_path, 'WEBP', quality=80, method=6)
    else:
        # PNG with transparency
        img.save(dst_path, 'WEBP', quality=85, method=6)
    
    src_size = os.path.getsize(src_path)
    dst_size = os.path.getsize(dst_path)
    savings = (1 - dst_size/src_size) * 100
    print(f"✓ {fname:30s} ({src_size:>7,} bytes) → {dst_name:30s} ({dst_size:>7,} bytes) - Saved {savings:.1f}%")