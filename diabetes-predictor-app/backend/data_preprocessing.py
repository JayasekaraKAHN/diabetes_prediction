import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import joblib

class DiabetesDataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.imputer_num = SimpleImputer(strategy='median')
        self.imputer_cat = SimpleImputer(strategy='most_frequent')
        self.feature_names = []
        
    def load_and_clean_data(self, file_path):
        """Load and clean the diabetes dataset with advanced preprocessing"""
        df = pd.read_csv(file_path)

        # Handle missing values
        df['age'] = df['age'].fillna(df['age'].median())
        df['bmi'] = df['bmi'].fillna(df['bmi'].median())
        df['HbA1c_level'] = df['HbA1c_level'].fillna(df['HbA1c_level'].median())
        df['blood_glucose_level'] = df['blood_glucose_level'].fillna(df['blood_glucose_level'].median())

        # Fill other numerical columns with median
        numerical_cols = ['hdl_cholesterol', 'triglycerides', 'sleep_hours']
        for col in numerical_cols:
            df[col] = df[col].fillna(df[col].median())

        # Fill categorical columns with mode
        categorical_cols = ['gender', 'smoking_history', 'obesity_status', 
                          'dietary_habits', 'alcohol_use']
        for col in categorical_cols:
            df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown')

        # Fill binary columns with 0
        binary_cols = ['hypertension', 'heart_disease', 'physical_inactivity', 
                      'prediabetes', 'high_blood_pressure']
        for col in binary_cols:
            df[col] = df[col].fillna(0)

        # Ensure diabetes column is clean
        df['diabetes'] = df['diabetes'].fillna(0)

        # --- Advanced Preprocessing ---
        # 1. Outlier handling (cap at 1st and 99th percentiles)
        outlier_cols = ['age', 'bmi', 'HbA1c_level', 'blood_glucose_level', 'hdl_cholesterol', 'triglycerides', 'sleep_hours']
        for col in outlier_cols:
            if col in df.columns:
                lower = df[col].quantile(0.01)
                upper = df[col].quantile(0.99)
                df[col] = df[col].clip(lower, upper)

        # 2. Log transform skewed features (add 1 to avoid log(0))
        skewed_cols = ['bmi', 'HbA1c_level', 'blood_glucose_level', 'hdl_cholesterol', 'triglycerides']
        for col in skewed_cols:
            if col in df.columns:
                df[col + '_log'] = np.log1p(df[col])

        # 3. Rare category grouping for categorical features
        rare_thresh = 0.01  # 1% threshold
        for col in categorical_cols:
            if col in df.columns:
                freq = df[col].value_counts(normalize=True)
                rare = freq[freq < rare_thresh].index
                df[col] = df[col].replace(rare, 'Other')

        # 4. Round all float columns to two decimal points
        float_cols = df.select_dtypes(include=['float', 'float64']).columns
        df[float_cols] = df[float_cols].round(2)

        return df
    
    def feature_engineering(self, df):
        """Create new features and select important ones"""
        # Create age groups
        df['age_group'] = pd.cut(df['age'], bins=[0, 30, 45, 60, 100], 
                               labels=['Young', 'Adult', 'Middle', 'Senior'])
        
        # Create BMI categories
        df['bmi_category'] = pd.cut(df['bmi'], bins=[0, 18.5, 25, 30, 100], 
                                  labels=['Underweight', 'Normal', 'Overweight', 'Obese'])
        
        # HbA1c risk categories
        df['HbA1c_risk'] = pd.cut(df['HbA1c_level'], bins=[0, 5.6, 6.4, 10], 
                                 labels=['Normal', 'Prediabetes', 'Diabetes'])
        
        # Glucose risk categories
        df['glucose_risk'] = pd.cut(df['blood_glucose_level'], bins=[0, 100, 125, 200, 300], 
                                  labels=['Normal', 'Prediabetic', 'Diabetic', 'High'])
        
        return df
    
    def encode_features(self, df):
        """Encode categorical features"""
        categorical_features = [
            'gender', 'smoking_history', 'obesity_status', 'dietary_habits', 
            'alcohol_use', 'age_group', 'bmi_category', 'HbA1c_risk', 'glucose_risk'
        ]
        
        for feature in categorical_features:
            if feature in df.columns:
                self.label_encoders[feature] = LabelEncoder()
                df[feature] = self.label_encoders[feature].fit_transform(
                    df[feature].astype(str)
                )
        
        return df
    
    def select_features(self, df):
        """Select features for model training"""
        feature_columns = [
            'age', 'hypertension', 'heart_disease', 'bmi', 'HbA1c_level', 
            'blood_glucose_level', 'physical_inactivity', 'prediabetes',
            'high_blood_pressure', 'hdl_cholesterol', 'triglycerides', 'sleep_hours',
            'gender', 'smoking_history', 'obesity_status', 'dietary_habits', 
            'alcohol_use', 'age_group', 'bmi_category', 'HbA1c_risk', 'glucose_risk'
        ]
        
        # Only use columns that exist in dataframe
        available_features = [col for col in feature_columns if col in df.columns]
        self.feature_names = available_features
        
        X = df[available_features]
        y = df['diabetes']
        
        return X, y
    
    def preprocess_data(self, file_path):
        """Main preprocessing pipeline"""
        # Load and clean data
        df = self.load_and_clean_data(file_path)
        
        # Feature engineering
        df = self.feature_engineering(df)
        
        # Encode categorical features
        df = self.encode_features(df)
        
        # Select features
        X, y = self.select_features(df)
        
        return X, y, df
    
    def prepare_training_data(self, X, y, test_size=0.2, random_state=42):
        """Split and scale data for training"""
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        # Scale numerical features
        numerical_cols = ['age', 'bmi', 'HbA1c_level', 'blood_glucose_level', 
                         'hdl_cholesterol', 'triglycerides', 'sleep_hours']
        numerical_cols = [col for col in numerical_cols if col in X.columns]
        
        X_train[numerical_cols] = self.scaler.fit_transform(X_train[numerical_cols])
        X_test[numerical_cols] = self.scaler.transform(X_test[numerical_cols])
        
        return X_train, X_test, y_train, y_test
    
    def save_preprocessor(self, file_path):
        """Save the preprocessor for later use"""
        preprocessor_data = {
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names
        }
        joblib.dump(preprocessor_data, file_path)
    
    def load_preprocessor(self, file_path):
        """Load a saved preprocessor"""
        preprocessor_data = joblib.load(file_path)
        self.scaler = preprocessor_data['scaler']
        self.label_encoders = preprocessor_data['label_encoders']
        self.feature_names = preprocessor_data['feature_names']
    
    def transform_new_data(self, data):
        """Transform new data for prediction"""
        # Convert to DataFrame if not already
        if not isinstance(data, pd.DataFrame):
            data = pd.DataFrame([data])
        
        # Ensure all features are present
        for feature in self.feature_names:
            if feature not in data.columns:
                data[feature] = 0  # or appropriate default value
        
        # Reorder columns to match training
        data = data[self.feature_names]
        
        # Encode categorical features
        for feature, encoder in self.label_encoders.items():
            if feature in data.columns:
                # Handle unseen labels
                data[feature] = data[feature].apply(
                    lambda x: x if x in encoder.classes_ else encoder.classes_[0]
                )
                data[feature] = encoder.transform(data[feature])
        
        # Scale numerical features
        numerical_cols = ['age', 'bmi', 'HbA1c_level', 'blood_glucose_level', 
                         'hdl_cholesterol', 'triglycerides', 'sleep_hours']
        numerical_cols = [col for col in numerical_cols if col in data.columns]
        
        if numerical_cols:
            data[numerical_cols] = self.scaler.transform(data[numerical_cols])
        
        return data

# Example usage
if __name__ == "__main__":
    preprocessor = DiabetesDataPreprocessor()
    X, y, df = preprocessor.preprocess_data('diabetes_raw_dataset.csv')
    X_train, X_test, y_train, y_test = preprocessor.prepare_training_data(X, y)

    # Save cleaned data to new CSV file
    df.to_csv('diabetes_cleaned_dataset.csv', index=False)
    print("Cleaned data saved to diabetes_cleaned_dataset.csv")

    print(f"Training set shape: {X_train.shape}")
    print(f"Test set shape: {X_test.shape}")
    print(f"Features: {preprocessor.feature_names}")