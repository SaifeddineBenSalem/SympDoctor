import pandas as pd
import json

try:
    file_path = 'python/Training.csv'  
    dataset = pd.read_csv(file_path)
    first_row_symptoms = dataset.columns.tolist()
    print(json.dumps(first_row_symptoms))
except Exception as e:
    print(f"Error occurred: {e}")
