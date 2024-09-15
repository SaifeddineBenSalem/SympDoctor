import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load the dataset
file_path = 'python/Training.csv'
dataset = pd.read_csv(file_path)

# Fill missing values with 'missing'
dataset.fillna('missing', inplace=True)

# Initialize LabelEncoder for disease labels
disease_encoder = LabelEncoder()

# Encode the Disease column
y = disease_encoder.fit_transform(dataset.iloc[:, -1])  

X = dataset.iloc[:, :-1]  

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the DecisionTreeClassifier
model = DecisionTreeClassifier(random_state=42)

# Train the model
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Calculate the accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy}')

# Save the trained model
model_path = 'python/decision_tree_model.pkl'
joblib.dump(model, model_path)

# Save the disease encoder
disease_encoder_path = 'python/disease_encoder.pkl'
joblib.dump(disease_encoder, disease_encoder_path)

print(f'Model saved to {model_path}')
print(f'Disease encoder saved to {disease_encoder_path}')
