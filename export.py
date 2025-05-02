import csv
import os
import base64
from PIL import Image
from io import BytesIO

# Set paths
csv_file = 'main.csv'  # <-- Replace with your actual CSV file name
output_dir = 'images'

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Increase the CSV field size limit
csv.field_size_limit(10**6)  # Increase to a larger size, like 1 MB or more if needed

image_counter = 1

with open(csv_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        product_name = row['Nome'].strip()
        image_data = row['Immagine 1024']

        # Clean folder name
        folder_name = os.path.join(output_dir, product_name.replace('/', '_').replace('\\', '_'))
        os.makedirs(folder_name, exist_ok=True)

        if image_data:
            try:
                # Decode and convert image to WebP
                img_bytes = base64.b64decode(image_data)
                img = Image.open(BytesIO(img_bytes)).convert("RGB")
                
                # Save image as "1.webp", "2.webp", ...
                img_path = os.path.join(folder_name, f"main_image.webp")
                img.save(img_path, format="WEBP", quality=80)
                print(f"Saved: {img_path}")
                image_counter += 1
            except Exception as e:
                print(f"Error processing image for {product_name}: {e}")
        else:
            print(f"No image data for: {product_name}")
