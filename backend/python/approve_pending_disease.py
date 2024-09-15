import csv
import os
import sys

def read_disease_data(disease_name, source_file):
    disease_data = None
    updated_rows = []
    with open(source_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['prognosis'] == disease_name:
                disease_data = row
            else:
                updated_rows.append(row)
    
    # Rewrite the source file without the disease row
    with open(source_file, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=reader.fieldnames)
        writer.writeheader()
        writer.writerows(updated_rows)
    
    return disease_data

def update_training_csv(disease_data, target_file):
    if disease_data is None:
        print("Disease not found in the source file.")
        return

    # Get symptoms that have a value of 1
    relevant_symptoms = [symptom for symptom, value in disease_data.items() if value == '1' and symptom != 'prognosis']

    # Read the existing data
    if not os.path.exists(target_file):
        with open(target_file, mode='w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=relevant_symptoms + ['prognosis'])
            writer.writeheader()
        existing_data = []
        header = relevant_symptoms + ['prognosis']
    else:
        with open(target_file, mode='r') as file:
            reader = csv.DictReader(file)
            existing_data = list(reader)
            header = list(reader.fieldnames) if reader.fieldnames else relevant_symptoms + ['prognosis']

    # Ensure the header contains all relevant symptoms
    for symptom in relevant_symptoms:
        if symptom not in header:
            header.insert(header.index('prognosis'), symptom)  # Insert before 'prognosis'

    # Prepare the new row with symptom values and the disease name
    new_row = {symptom: '1' if symptom in relevant_symptoms else '0' for symptom in header}
    new_row['prognosis'] = disease_data['prognosis']

    # Update existing rows to include new symptoms with a default value of 0
    updated_existing_data = []  # List to store updated data
    for row in existing_data:
        updated_row = {symptom: row.get(symptom, '0') for symptom in header}
        updated_existing_data.append(updated_row)

    # Write the updated data and the new row to the CSV
    with open(target_file, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=header)
        writer.writeheader()
        writer.writerows(updated_existing_data)  # Write the updated existing rows
        writer.writerow(new_row)  # Write the new row

def main():
    if len(sys.argv) != 2:
        print("Usage: python update_training.py '<disease_name>'")
        sys.exit(1)

    disease_name = sys.argv[1]

    source_file = 'python/Training1.csv'
    target_file = 'python/Training.csv'
    disease_name = disease_name.replace('"', '')
    print(f"Reading data for disease: {disease_name}")  # Debugging
    disease_data = read_disease_data(disease_name, source_file)
    update_training_csv(disease_data, target_file)

if __name__ == '__main__':
    main()
