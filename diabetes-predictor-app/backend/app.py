from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from typing import Optional
import uvicorn

# Import your classes
from model_training import DiabetesPredictor

app = FastAPI(title="Diabetes Prediction API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
predictor = DiabetesPredictor()

# Load trained model
try:
    predictor.load_model('diabetes_model.pkl', 'diabetes_preprocessor.pkl')
    print("Model loaded successfully!")
except:
    print("Model files not found. Please train the model first.")

class DiabetesPredictionRequest(BaseModel):
    age: float
    hypertension: int
    heart_disease: int
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float
    physical_inactivity: int
    prediabetes: int
    high_blood_pressure: int
    hdl_cholesterol: float
    triglycerides: float
    sleep_hours: float
    gender: str
    smoking_history: str
    obesity_status: str
    dietary_habits: str
    alcohol_use: str

class DiabetesPredictionResponse(BaseModel):
    prediction: int
    probability: float
    risk_level: str
    message: str

@app.get("/")
async def root():
    return {"message": "Diabetes Prediction API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": predictor.model is not None}

@app.post("/predict", response_model=DiabetesPredictionResponse)
async def predict_diabetes(request: DiabetesPredictionRequest):
    try:
        # Convert request to dictionary
        input_data = request.dict()
        
        # Make prediction
        prediction, probability = predictor.predict_class(input_data)
        
        # Determine risk level
        if probability < 0.3:
            risk_level = "Low"
            message = "Low risk of diabetes"
        elif probability < 0.7:
            risk_level = "Medium"
            message = "Moderate risk of diabetes. Consider lifestyle changes."
        else:
            risk_level = "High"
            message = "High risk of diabetes. Please consult a healthcare professional."
        
        return DiabetesPredictionResponse(
            prediction=prediction,
            probability=probability,
            risk_level=risk_level,
            message=message
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/features")
async def get_feature_info():
    """Get information about required features and their formats"""
    feature_info = {
        "age": {"type": "float", "description": "Age in years", "range": "0-120"},
        "hypertension": {"type": "integer", "description": "Hypertension status", "values": "0 (No), 1 (Yes)"},
        "heart_disease": {"type": "integer", "description": "Heart disease status", "values": "0 (No), 1 (Yes)"},
        "bmi": {"type": "float", "description": "Body Mass Index", "range": "10-60"},
        "HbA1c_level": {"type": "float", "description": "HbA1c level", "range": "3-10"},
        "blood_glucose_level": {"type": "float", "description": "Blood glucose level", "range": "50-300"},
        "physical_inactivity": {"type": "integer", "description": "Physical inactivity", "values": "0 (Active), 1 (Inactive)"},
        "prediabetes": {"type": "integer", "description": "Prediabetes status", "values": "0 (No), 1 (Yes)"},
        "high_blood_pressure": {"type": "integer", "description": "High blood pressure", "values": "0 (No), 1 (Yes)"},
        "hdl_cholesterol": {"type": "float", "description": "HDL Cholesterol", "range": "10-100"},
        "triglycerides": {"type": "float", "description": "Triglycerides level", "range": "50-300"},
        "sleep_hours": {"type": "float", "description": "Average sleep hours per night", "range": "0-12"},
        "gender": {"type": "string", "description": "Gender", "values": "M (Male), F (Female)"},
        "smoking_history": {"type": "string", "description": "Smoking history", "values": "never, former, current, ever, not current, No Info"},
        "obesity_status": {"type": "string", "description": "Obesity status", "values": "Underweight, Normal, Overweight, Obese"},
        "dietary_habits": {"type": "string", "description": "Dietary habits", "values": "Healthy, High-sugar, High-energy, Low-fiber, Mixed"},
        "alcohol_use": {"type": "string", "description": "Alcohol consumption", "values": "None, Moderate, Heavy"}
    }
    
    return feature_info

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)