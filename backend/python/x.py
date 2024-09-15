import pandas as pd
import json
import sys

try:
    file_path = 'python/Training.csv'
    df = pd.read_csv(file_path)
    disease_name = sys.argv[1]
    disease_name = disease_name.replace('"', '')
    
    # Find all rows where 'prognosis' matches disease_name
    selected_rows = df.loc[df['prognosis'] == disease_name]
    
    # Initialize a list to store all lists of symptom names
    all_symptom_lists = []
    
    # Iterate through each matching row
    for _, row in selected_rows.iterrows():
        # Collect column names where the value is 1 as a list
        symptom_names = [col for col in row.index if row[col] == 1]
        all_symptom_lists.append(symptom_names)
    
    # Print the list of lists in JSON format
    print(json.dumps(all_symptom_lists))
        
except Exception as e:
    print(f"Error occurred: {e}")
