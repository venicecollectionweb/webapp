import os
import re

# Set the parent directory where your images folder is located
parent_dir = 'venice-catalog/public/images/'

# List all subfolders in the 'images' directory
for folder_name in os.listdir(parent_dir):
    folder_path = os.path.join(parent_dir, folder_name)
    
    # Check if it's a directory
    if os.path.isdir(folder_path):
        # Find text inside square brackets using regular expression
        match = re.search(r'\[([^\]]+)\]', folder_name)
        
        # If we found text inside square brackets
        if match:
            new_folder_name = match.group(1)  # Extract the text inside the brackets
            new_folder_path = os.path.join(parent_dir, new_folder_name)
            
            # Rename the folder
            os.rename(folder_path, new_folder_path)
            print(f"Renamed: {folder_name} -> {new_folder_name}")
        else:
            print(f"No square brackets found in folder: {folder_name}")
