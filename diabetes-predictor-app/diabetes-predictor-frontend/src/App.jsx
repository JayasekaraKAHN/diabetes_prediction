import React, { useState } from 'react';
import DiabetesForm from './components/DiabetesForm';
import PredictionResult from './components/PredictionResult';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePrediction = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError('Failed to get prediction. Please check if the backend server is running.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPrediction(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Diabetes Risk Predictor
          </h1>
          <p className="text-lg text-gray-600">
            Assess your risk of diabetes using machine learning
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!prediction ? (
          <DiabetesForm 
            onSubmit={handlePrediction} 
            loading={loading} 
          />
        ) : (
          <PredictionResult 
            prediction={prediction} 
            onReset={resetForm} 
          />
        )}
      </div>
    </div>
  );
}

export default App;