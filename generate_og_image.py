from PIL import Image, ImageDraw, ImageFont
import os

output_dir = r"c:\Users\dell\Downloads\windekGroup\windekGroup\img"
width, height = 1200, 630

img = Image.new('RGB', (width, height), color=(7, 17, 38))
draw = ImageDraw.Draw(img)

# Draw grid lines
for x in range(0, width, 60):
    draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 5), width=1)
for y in range(0, height, 60):
    draw.line([(0, y), (width, y)], fill=(255, 255, 255, 5), width=1)

# Draw accent bar
draw.rectangle([0, 0, 8, height], fill=(18, 132, 191))

# Draw decorative circles
draw.ellipse([900, -100, 1150, 150], fill=(48, 43, 129, 80))
draw.ellipse([850, 450, 1100, 700], fill=(18, 132, 191, 60))

# Draw the logo at the top center
logo_path = os.path.join(output_dir, "Windek Group Logo.png")
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    
    # Resize logo to fit nicely - about 220px width
    logo_ratio = 220 / logo.width
    logo_h = int(logo.height * logo_ratio)
    logo = logo.resize((220, logo_h), Image.LANCZOS)
    
    # Center the logo horizontally, place at y=80
    logo_x = (width - 220) // 2
    logo_y = 60
    img.paste(logo, (logo_x, logo_y), logo)

# Try to use a bold font for the title
title_font_size = 56
try:
    # Check for common Windows fonts
    font_paths = [
        "C:\\Windows\\Fonts\\impact.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\segoeui.ttf",
    ]
    font = None
    for fp in font_paths:
        if os.path.exists(fp):
            font = ImageFont.truetype(fp, title_font_size)
            break
    if not font:
        font = ImageFont.load_default()
except:
    font = ImageFont.load_default()

# Title text
title = "Energy Infrastructure,\nProcurement & Logistics"
lines = title.split('\n')
y_start = 220
for i, line in enumerate(lines):
    # Get text size
    try:
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
    except:
        tw = len(line) * title_font_size * 0.6
    tx = (width - tw) // 2
    ty = y_start + i * (title_font_size + 10)
    draw.text((tx, ty), line, fill=(255, 255, 255), font=font)

# Subtitle
sub_font_size = 24
try:
    for fp in ["C:\\Windows\\Fonts\\arial.ttf", "C:\\Windows\\Fonts\\segoeuii.ttf"]:
        if os.path.exists(fp):
            sub_font = ImageFont.truetype(fp, sub_font_size)
            break
    else:
        sub_font = ImageFont.load_default()
except:
    sub_font = ImageFont.load_default()

subtitle = "Windek Group — Integrated Industrial Solutions"
try:
    bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
    sw = bbox[2] - bbox[0]
except:
    sw = len(subtitle) * 14
draw.text(((width - sw) // 2, 370), subtitle, fill=(18, 132, 191), font=sub_font)

# Bottom bar with url
url_text = "windekgroup.com"
try:
    bbox = draw.textbbox((0, 0), url_text, font=sub_font)
    uw = bbox[2] - bbox[0]
except:
    uw = len(url_text) * 14
draw.text(((width - uw) // 2, 560), url_text, fill=(255, 255, 255, 150), font=sub_font)

# Save
output_path = os.path.join(output_dir, "og-image.png")
img.save(output_path, 'PNG')
print(f"OG image saved: {output_path} ({os.path.getsize(output_path):,} bytes)")

# Also save WebP version
output_webp = os.path.join(output_dir, "og-image.webp")
img.save(output_webp, 'WEBP', quality=85)
print(f"OG image WebP saved: {output_webp} ({os.path.getsize(output_webp):,} bytes)")