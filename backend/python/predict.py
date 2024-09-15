import sys
import json
import pandas as pd
import joblib

# Load the dataset and features
file_path = 'python/Training.csv'
dataset = pd.read_csv(file_path)
X = dataset.iloc[:, :-1]

# Load the saved model and encoders
model = joblib.load('python/decision_tree_model.pkl')
disease_encoder = joblib.load('python/disease_encoder.pkl')

# Function to load and preprocess input symptoms
def preprocess_input(input_json):
    try:
        # Load JSON string into a Python dictionary
        input_symptoms = json.loads(input_json)
        # Convert the dictionary into a DataFrame for prediction
        input_df = pd.DataFrame([input_symptoms])
        # Ensure columns are in the same order as during training
        input_df = input_df[X.columns]
        return input_df
    except ValueError as e:
        raise ValueError('Invalid JSON format. Please provide a valid JSON object.') from e

if __name__ == "__main__":
    # Check if a JSON string was passed as an argument
    if len(sys.argv) < 2:
        print("Usage: python predict.py '<json_string>'")
        sys.exit(1)
    
    # Get JSON string from command line argument
    input_json = sys.argv[1]
    
    # Preprocess input JSON
    input_df = preprocess_input(input_json)
    
    # Predict using the loaded model
    predicted_disease = model.predict(input_df)
    
    # Decode the predicted disease using the label encoder
    predicted_disease_name = disease_encoder.inverse_transform(predicted_disease)[0]
    
    # Print the predicted disease
    print(predicted_disease_name)
    
    # Terminate with exit code 0 indicating successful execution
    sys.exit(0)
