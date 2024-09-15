import pandas as pd
import json

try:
    file_path = 'python/Training1.csv'
    df = pd.read_csv(file_path)
    diseases = df['prognosis'].unique().tolist()
    print(json.dumps(diseases))

except Exception as e:
    print(json.dumps(null))
    print(f"Error occurred: {e}")
