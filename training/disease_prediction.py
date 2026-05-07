import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import warnings
import matplotlib.pyplot as plt
import seaborn as sns

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

def preprocess_dataset(file_path):
    """
    Load and preprocess the infectious disease dataset.
    - Filters to only include 4 target diseases: Malaria, Dengue, Typhoid, Gastroenteritis.
    - Standardizes the symptoms while keeping severity-based symptoms separate.
    - Transforms the data into 33 binary feature columns and 1 target variable column.
    """
    print(f"Loading dataset from '{file_path}'...")
    df = pd.read_csv(file_path)
    
    print("Filtering dataset for the specified diseases...")
    target_diseases = ['Malaria', 'Dengue', 'Typhoid', 'Gastroenteritis']
    df = df[df['Disease'].isin(target_diseases)].copy()
    
    # Strip any leading/trailing spaces across all string columns
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].str.strip()
            
    print("Extracting and standardizing EXACTLY 33 predefined symptoms into binary features...")
    
    # We will standardize specific symptoms that are essentially synonyms
    # CRITICAL RULE: We ensure severity-based symptoms remain as completely separate features!
    # Validations:
    # - `vomiting` and `persistent_vomiting` will NOT be merged.
    # - `sweating` and `profuse sweating` will NOT be merged.
    standardization_map = {
        'abdominal(belly)_pain': 'abdominal_pain',
        'belly_pain': 'abdominal_pain'
    }
    
    # Exactly 33 predefined symptoms to isolate as attributes
    valid_symptoms = [
        'abdominal_pain', 'back_pain', 'bleeding_gums_or_nosebleeds', 
        'blood_spots', 'chills', 'constipation', 'dark_urine', 
        'dehydration', 'diarrhoea', 'dry_cough', 'fatigue', 'headache', 
        'high_fever', 'joint_pain', 'loss_of_appetite', 'malaise', 
        'muscle_pain', 'nausea', 'pain_behind_the_eyes', 'persistent_vomiting', 
        'pink_spots', 'profuse sweating', 'rapid_onset', 'red_spots_over_body', 
        'saddleback_fever', 'severe stomach cramps', 'skin_rash', 'step_ladder_fever', 
        'sunken_eyes', 'sweating', 'toxic_look_(typhos)', 'vomiting', 
        'yellowing_of_eyes (Mild Jaundice)'
    ]
    
    symptom_cols = [col for col in df.columns if col != 'Disease']
    structured_data = []
    
    # Iterate over original records and reconstruct as binary flags
    for _, row in df.iterrows():
        disease = row['Disease']
        symptoms_present = set()
        
        # Collect symptoms present for the current patient's record across all columns
        for col in symptom_cols:
            raw_symptom = row[col]
            if pd.notna(raw_symptom) and str(raw_symptom).strip() != '':
                symptom = str(raw_symptom).strip()
                
                # Standardize synonyms (e.g., mapping belly_pain to abdominal_pain)
                symptom = standardization_map.get(symptom, symptom)
                
                # Check against our exact matching 33 validation list
                if symptom in valid_symptoms:
                    symptoms_present.add(symptom)
                    
        # Create a dictionary initialized to zeros (absence of symptom == 0)
        record = {sym: 0 for sym in valid_symptoms}
        record['Disease'] = disease
        
        # Update the features to ones (presence of symptom == 1)
        for sym in symptoms_present:
            record[sym] = 1
            
        structured_data.append(record)
        
    final_df = pd.DataFrame(structured_data)
    
    # Reorder columns to have exactly 33 binary features followed by the Disease target
    feature_cols = sorted(valid_symptoms)
    final_df = final_df[feature_cols + ['Disease']]
    
    print(f"Preprocessing completed. Final dataset dimension: {final_df.shape}")
    return final_df

def train_and_evaluate_model(df):
    """
    Creates an 80/20 train-test split, trains a Random Forest Classifier, 
    and outputs a comprehensive evaluation in the terminal.
    """
    print("\nSplitting data into 80% training and 20% testing sets...")
    X = df.drop('Disease', axis=1)
    y = df['Disease']
    
    # Fixed random state for reproducibility 
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Multinomial Naive Bayes Classifier...")
    # Naive Bayes is mathematically ideal for sparse symptom data and gracefully handles missing symptoms!
    model = MultinomialNB(alpha=1.0)
    model.fit(X_train, y_train)
    
    print("Predicting and Evaluating model...\n")
    y_pred = model.predict(X_test)
    
    print("="*60)
    print("                 MODEL EVALUATION RESULTS")
    print("="*60)
    
    # 1. Overall Accuracy
    acc = accuracy_score(y_test, y_pred)
    print(f"Overall Accuracy Score: {acc:.4f}\n")
    
    # Labels for exact ordering in output
    target_labels = ['Dengue', 'Gastroenteritis', 'Malaria', 'Typhoid']
    
    # 2. Detailed Classification Report (Precision, Recall, F1-Score)
    print("Classification Report:")
    print("-" * 60)
    print(classification_report(y_test, y_pred, labels=target_labels, target_names=target_labels))
    
    # 3. Confusion Matrix
    print("Confusion Matrix:")
    print("-" * 60)
    cm = confusion_matrix(y_test, y_pred, labels=target_labels)
    
    cm_df = pd.DataFrame(cm, 
                         index=[f'True: {lbl}' for lbl in target_labels], 
                         columns=[f'Pred: {lbl}' for lbl in target_labels])
    print(cm_df.to_string())
    print("="*60)
    
    # Generate and save visual confusion matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=target_labels, yticklabels=target_labels)
    plt.title('Infectious Disease Prediction Confusion Matrix')
    plt.ylabel('Actual Disease')
    plt.xlabel('Predicted Disease')
    plt.tight_layout()
    
    # Save to the root directory as per constraints
    plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    return model

def main():
    # Execute the machine learning pipeline sequentially 
    dataset_file = 'symptoms.csv'
    
    try:
        # Phase 1: Preprocessing & Feature Engineering
        clean_df = preprocess_dataset(dataset_file)
        
        # Phase 2 & 3: Model Training and Evaluation  
        trained_model = train_and_evaluate_model(clean_df)
        
        # Phase 4: Model Export
        model_export_path = 'disease_prediction_model.pkl'
        print(f"\nSerializing model to disk...")
        joblib.dump(trained_model, model_export_path)
        print(f"Success! Saved pipeline model as '{model_export_path}' for future usage.")
        
    except FileNotFoundError:
        print(f"\n[ERROR] File '{dataset_file}' not found. Please ensure it is present in the current directory.")
    except Exception as e:
        print(f"\n[ERROR] An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    main()
