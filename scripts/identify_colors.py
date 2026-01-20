import os
import sys
from PIL import Image
import colorsys

def get_dominant_color(image_path):
    try:
        img = Image.open(image_path)
        img = img.resize((50, 50))  # Resize for speed
        img = img.convert('RGB')
        
        r_total, g_total, b_total = 0, 0, 0
        count = 0
        
        width, height = img.size
        for x in range(width):
            for y in range(height):
                r, g, b = img.getpixel((x, y))
                # Ignore white-ish or black-ish background pixels to focus on the map color
                # Assuming map is colored and background is either very light or dark
                # Let's verify saturation.
                h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
                
                # Filter out low saturation (greys/whites/blacks for color detection, except for grey itself)
                # But we need to detect GREY too.
                # So maybe we just collect all and see what dominates?
                
                if s > 0.15 and v > 0.2: # Ignore very white/grey/black background
                    r_total += r
                    g_total += g
                    b_total += b
                    count += 1
        
        if count == 0:
            # Maybe it IS the grey map?
            # Let's count again without filter
            for x in range(width):
                for y in range(height):
                    r, g, b = img.getpixel((x, y))
                    r_total += r
                    g_total += g
                    b_total += b
                    count += 1
        
        avg_r = r_total / count
        avg_g = g_total / count
        avg_b = b_total / count
        
        h, s, v = colorsys.rgb_to_hsv(avg_r/255, avg_g/255, avg_b/255)
        degree = h * 360
        
        # Classification
        if s < 0.1: # Very low saturation -> Grey
            return "grey"
        
        if (degree >= 340 or degree <= 15):
            return "red"
        elif (degree > 15 and degree <= 45):
            return "orange"
        elif (degree > 45 and degree <= 75):
            return "yellow"
        elif (degree > 75 and degree <= 160):
            return "green"
        elif (degree > 240 and degree <= 320):
            return "purple"
        else:
            return "unknown" # (e.g. blue)

    except Exception as e:
        return str(e)

directory = "/Users/omx/design-update/weather10/map_images"
files = [f for f in os.listdir(directory) if f.lower().endswith(('.jpeg', '.jpg', '.png')) and "error" not in f]

results = {}
for f in files:
    color = get_dominant_color(os.path.join(directory, f))
    print(f"File: {f} -> Color: {color}")
