import os
import csv

# Path to the images directory
images_directory = 'venice-catalog/public/images/'

# Output CSV file
csv_filename = 'product_images.csv'

# Function to generate product image data
def generate_product_image_data():
    product_data = []

    # Walk through the product directories
    for product_folder in os.listdir(images_directory):
        product_folder_path = os.path.join(images_directory, product_folder)

        # Skip if it's not a directory
        if not os.path.isdir(product_folder_path):
            continue

        # List all image files in the product folder
        product_images = [
            file for file in os.listdir(product_folder_path)
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))
        ]

        # Add product data to the list
        if product_images:
            product_data.append({
                'Product ID': product_folder,
                'Images': ', '.join(product_images)  # Join images with commas
            })

    # Write data to CSV
    with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=['Product ID', 'Images'])
        writer.writeheader()
        writer.writerows(product_data)

    print(f'CSV file "{csv_filename}" has been written successfully.')

# Run the function
generate_product_image_data()
