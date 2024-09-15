import pandas as pd
import json
import sys
try:
    file_path = 'python/Training2.csv'
    df = pd.read_csv(file_path)
    disease_name = sys.argv[1]
    disease_name = disease_name.replace('"', '')
    selected_row = df.loc[df['prognosis'] == disease_name]
    # Filter the row to keep only the columns with a value of 1
    filtered_row = selected_row.loc[:, (selected_row == 1).any()]
    symptom_names = filtered_row.columns.tolist()
    print(json.dumps(symptom_names))
except Exception as e:
    print(f"Error occurred: {e}")