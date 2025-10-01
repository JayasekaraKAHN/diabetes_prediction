import React, { useState } from 'react';

const DiabetesForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    age: '',
    hypertension: 0,
    heart_disease: 0,
    bmi: '',
    HbA1c_level: '',
    blood_glucose_level: '',
    physical_inactivity: 0,
    prediabetes: 0,
    high_blood_pressure: 0,
    hdl_cholesterol: '',
    triglycerides: '',
    sleep_hours: '',
    gender: 'M',
    smoking_history: 'never',
    obesity_status: 'Normal',
    dietary_habits: 'Mixed',
    alcohol_use: 'None'
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 1 : 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Personal Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="120"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BMI
              </label>
              <input
                type="number"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="10"
                max="60"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Obesity Status
              </label>
              <select
                name="obesity_status"
                value={formData.obesity_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Underweight">Underweight</option>
                <option value="Normal">Normal</option>
                <option value="Overweight">Overweight</option>
                <option value="Obese">Obese</option>
              </select>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Health Metrics
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HbA1c Level
              </label>
              <input
                type="number"
                name="HbA1c_level"
                value={formData.HbA1c_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="3"
                max="10"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Glucose Level
              </label>
              <input
                type="number"
                name="blood_glucose_level"
                value={formData.blood_glucose_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="50"
                max="300"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HDL Cholesterol
              </label>
              <input
                type="number"
                name="hdl_cholesterol"
                value={formData.hdl_cholesterol}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="10"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Triglycerides
              </label>
              <input
                type="number"
                name="triglycerides"
                value={formData.triglycerides}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="50"
                max="300"
                step="0.1"
                required
              />
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Lifestyle Factors
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sleep Hours
              </label>
              <input
                type="number"
                name="sleep_hours"
                value={formData.sleep_hours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="12"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Smoking History
              </label>
              <select
                name="smoking_history"
                value={formData.smoking_history}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="never">Never</option>
                <option value="former">Former</option>
                <option value="current">Current</option>
                <option value="ever">Ever</option>
                <option value="not current">Not Current</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dietary Habits
              </label>
              <select
                name="dietary_habits"
                value={formData.dietary_habits}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Healthy">Healthy</option>
                <option value="High-sugar">High-sugar</option>
                <option value="High-energy">High-energy</option>
                <option value="Low-fiber">Low-fiber</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alcohol Use
              </label>
              <select
                name="alcohol_use"
                value={formData.alcohol_use}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="None">None</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Health Conditions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Health Conditions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'hypertension', label: 'Hypertension' },
              { name: 'heart_disease', label: 'Heart Disease' },
              { name: 'physical_inactivity', label: 'Physical Inactivity' },
              { name: 'prediabetes', label: 'Prediabetes' },
              { name: 'high_blood_pressure', label: 'High Blood Pressure' }
            ].map((condition) => (
              <label key={condition.name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={condition.name}
                  checked={formData[condition.name] === 1}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{condition.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Predicting...' : 'Predict Diabetes Risk'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiabetesForm;