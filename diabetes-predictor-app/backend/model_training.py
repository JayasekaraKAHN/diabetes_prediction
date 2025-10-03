import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import cross_val_score, GridSearchCV
import joblib
from data_preprocessing import DiabetesDataPreprocessor

# Main class for diabetes prediction
class DiabetesPredictor:
    def __init__(self):
        self.model = None
        self.preprocessor = DiabetesDataPreprocessor()
        self.best_params = None
        
    def train_models(self, file_path, model_type='random_forest'):
        """Train different models and select the best one"""
        
        # Preprocess data
        X, y, df = self.preprocessor.preprocess_data(file_path)
        X_train, X_test, y_train, y_test = self.preprocessor.prepare_training_data(X, y)
        
        print("Dataset Info:")
        print(f"Total samples: {len(df)}")
        print(f"Diabetes cases: {y.sum()} ({y.mean()*100:.2f}%)")
        print(f"Non-diabetes cases: {len(y) - y.sum()} ({(1-y.mean())*100:.2f}%)")
        
        if model_type == 'random_forest':
            self.model = RandomForestClassifier(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            )
        elif model_type == 'logistic_regression':
            self.model = LogisticRegression(random_state=42, max_iter=1000)
        elif model_type == 'svm':
            self.model = SVC(probability=True, random_state=42)
        else:
            raise ValueError("Unsupported model type")
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]
        
        print(f"\nModel: {model_type}")
        print(f"Training Accuracy: {train_score:.4f}")
        print(f"Test Accuracy: {test_score:.4f}")
        print(f"ROC AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Feature importance (for tree-based models)
        if hasattr(self.model, 'feature_importances_'):
            feature_importance = pd.DataFrame({
                'feature': self.preprocessor.feature_names,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False)
            
            print("\nTop 10 Feature Importances:")
            print(feature_importance.head(10))
        
        return self.model, (X_test, y_test)
    
    def hyperparameter_tuning(self, X_train, y_train):
        """Perform hyperparameter tuning for Random Forest"""
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 15, 20, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4]
        }
        
        rf = RandomForestClassifier(random_state=42)
        grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
        grid_search.fit(X_train, y_train)
        
        self.best_params = grid_search.best_params_
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best cross-validation score: {grid_search.best_score_:.4f}")
        
        return grid_search.best_estimator_
    
    def predict_probability(self, input_data):
        """Predict diabetes probability for new data"""
        if self.model is None:
            raise ValueError("Model not trained. Please train the model first.")
        
        # Transform input data
        processed_data = self.preprocessor.transform_new_data(input_data)
        
        # Make prediction
        probability = self.model.predict_proba(processed_data)[0, 1]
        
        return probability
    
    def predict_class(self, input_data, threshold=0.5):
        """Predict diabetes class for new data"""
        probability = self.predict_probability(input_data)
        prediction = 1 if probability >= threshold else 0
        
        return prediction, probability
    
    def save_model(self, model_path, preprocessor_path):
        """Save trained model and preprocessor"""
        joblib.dump(self.model, model_path)
        self.preprocessor.save_preprocessor(preprocessor_path)
        print(f"Model saved to {model_path}")
        print(f"Preprocessor saved to {preprocessor_path}")
    
    def load_model(self, model_path, preprocessor_path):
        """Load trained model and preprocessor"""
        self.model = joblib.load(model_path)
        self.preprocessor.load_preprocessor(preprocessor_path)
        print(f"Model loaded from {model_path}")

# Example usage and training
if __name__ == "__main__":
    # Initialize and train model
    predictor = DiabetesPredictor()
    
    # Train the model
    model, (X_test, y_test) = predictor.train_models('diabetes_raw_dataset.csv')
    
    # Save the model
    predictor.save_model('diabetes_model.pkl', 'diabetes_preprocessor.pkl')
    
    # Example prediction
    sample_data = {
        'age': 45,
        'hypertension': 0,
        'heart_disease': 0,
        'bmi': 28.5,
        'HbA1c_level': 6.2,
        'blood_glucose_level': 140,
        'physical_inactivity': 1,
        'prediabetes': 1,
        'high_blood_pressure': 0,
        'hdl_cholesterol': 45.0,
        'triglycerides': 150.0,
        'sleep_hours': 6.5,
        'gender': 'M',
        'smoking_history': 'never',
        'obesity_status': 'Overweight',
        'dietary_habits': 'Mixed',
        'alcohol_use': 'Moderate'
    }
    
    prediction, probability = predictor.predict_class(sample_data)
    print(f"\nSample Prediction:")
    print(f"Diabetes Probability: {probability:.4f}")
    print(f"Prediction: {'Diabetic' if prediction == 1 else 'Non-Diabetic'}")