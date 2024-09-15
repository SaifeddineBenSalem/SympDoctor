import pandas as pd
import json

try:
    file_path = 'Training.csv'
    df = pd.read_csv(file_path)

# Extract the list of diseases
    diseases = df['prognosis'].unique().tolist()
    print(json.dumps(diseases))
except Exception as e:
    print(f"Error occurred: {e}")