import React from 'react';

const PredictionResult = ({ prediction, onReset }) => {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return '✅';
      case 'medium':
        return '⚠️';
      case 'high':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Prediction Result
        </h2>
        <p className="text-gray-600">
          Based on the provided information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center p-4 border rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {(prediction.probability * 100).toFixed(1)}%
          </div>
          <div className="text-gray-600">Probability</div>
        </div>

        <div className="text-center p-4 border rounded-lg">
          <div className={`text-xl font-bold px-3 py-1 rounded-full ${getRiskColor(prediction.risk_level)}`}>
            {getRiskIcon(prediction.risk_level)} {prediction.risk_level} Risk
          </div>
          <div className="text-gray-600 mt-2">Risk Level</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Assessment:</h3>
        <p className="text-gray-700">{prediction.message}</p>
      </div>

      {prediction.risk_level.toLowerCase() === 'high' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-red-800 mb-2">Recommendations:</h4>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            <li>Consult with a healthcare professional immediately</li>
            <li>Monitor your blood sugar levels regularly</li>
            <li>Consider lifestyle changes including diet and exercise</li>
            <li>Schedule regular health check-ups</li>
          </ul>
        </div>
      )}

      {prediction.risk_level.toLowerCase() === 'medium' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">Recommendations:</h4>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Consider consulting with a healthcare professional</li>
            <li>Adopt a healthier diet and regular exercise routine</li>
            <li>Monitor your health metrics regularly</li>
            <li>Reduce risk factors like smoking and excessive alcohol</li>
          </ul>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Make Another Prediction
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>
          <strong>Disclaimer:</strong> This prediction is based on machine learning algorithms 
          and should not replace professional medical advice. Please consult with healthcare 
          professionals for accurate diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default PredictionResult;