import json
import csv
import os
import sys

def update_csv(data):
    file_path = os.path.join(os.path.dirname(__file__), 'Training1.csv')
    symptoms = data['symptoms']
    disease_name = symptoms.pop('prognosis')  # Remove prognosis from symptoms and store its value
    all_symptoms = data['allSymptoms']

    # Create the file if it doesn't exist and write the header
    if not os.path.exists(file_path):
        with open(file_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(all_symptoms)  # Write header with all symptoms

    # Read the existing data
    with open(file_path, mode='r') as file:
        reader = csv.reader(file)
        existing_data = list(reader)
        header = existing_data[0] if existing_data else all_symptoms

    # Ensure the header contains all symptoms
    for symptom in all_symptoms:
        if symptom not in header:
            header.append(symptom)
    
    # Ensure 'prognosis' is the last item in the header
    if 'prognosis' in header:
        header.remove('prognosis')
    header.append('prognosis')

    # Prepare the new row with symptom values
    new_row = [symptoms.get(symptom, 0) for symptom in header[:-1]]  # All but last
    new_row.append(disease_name)  # Append the disease name at the end

    # Update existing rows to include new symptoms with a default value of 0
    updated_existing_data = [header]  # Start with updated header
    for row in existing_data[1:]:
        updated_row = row[:-1]  # Exclude the disease name from existing rows
        disease = row[-1]
        # Add default 0 for any new symptoms in the header
        updated_row += [0] * (len(header[:-1]) - len(updated_row))
        updated_row.append(disease)
        updated_existing_data.append(updated_row)

    # Write the updated data and the new row to the CSV
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(updated_existing_data)  # Write the updated existing rows
        writer.writerow(new_row)  # Write the new row

def main():
    if len(sys.argv) != 2:
        print("Usage: python update_training.py '<json_data>'")
        sys.exit(1)
    
    json_data = sys.argv[1]
    print(f"Received JSON data: {json_data}")  # Debugging

    data = json.loads(json_data)
    update_csv(data)

if __name__ == '__main__':
    main()
