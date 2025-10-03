import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Heart, 
  Activity, 
  Loader2 
} from 'lucide-react';

// Main Form Component
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

  const [activeSection, setActiveSection] = useState(0);

  // Handle input changes
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

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeSection === sections.length - 1) {
      onSubmit(formData);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && activeSection < sections.length - 1) {
      e.preventDefault();
      handleNextSection();
    }
  };

  // Navigation
  const handleNextSection = () => {
    if (activeSection < sections.length - 1 && !isNextDisabled()) {
      setActiveSection(prev => prev + 1);
    }
  };

  const handlePreviousSection = () => {
    if (activeSection > 0) {
      setActiveSection(prev => prev - 1);
    }
  };

  // Disable Submit button
const isSubmitDisabled = () => {
  // Check required fields in the last section (Lifestyle Factors)
  return !formData.sleep_hours || !formData.smoking_history || !formData.alcohol_use;
};


  // Sections
  const sections = [
    { icon: User, title: 'Personal Information', color: 'blue' },
    { icon: Heart, title: 'Health Metrics', color: 'green' }, // Health Conditions included
    { icon: Activity, title: 'Lifestyle Factors', color: 'purple' }
  ];

  // Disable Next button
  const isNextDisabled = () => {
    switch(activeSection) {
      case 0:
        return !formData.age || !formData.bmi;
      case 1:
        return !formData.HbA1c_level || !formData.blood_glucose_level || !formData.hdl_cholesterol || !formData.triglycerides;
      case 2:
        return !formData.sleep_hours;
      default:
        return true;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
    >
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Health Assessment</h2>
        <p className="text-blue-100 mb-6">Complete all sections for accurate diabetes risk prediction</p>
        
        <div className="flex space-x-4 mb-2">
          {sections.map((section, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSection(index)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                activeSection === index 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 h-2 rounded-full mt-4">
          <motion.div
            className="h-2 bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-8">
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Personal Information */}
              {activeSection === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min="0" max="120" step="1" required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">BMI</label>
                    <input
                      type="number"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min="10" max="60" step="0.1" required
                    />
                    {(formData.bmi && (formData.bmi < 10 || formData.bmi > 60)) && (
                      <p className="text-red-500 text-sm mt-1">BMI should be between 10 and 60</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Obesity Status</label>
                    <select
                      name="obesity_status"
                      value={formData.obesity_status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Underweight">Underweight</option>
                      <option value="Normal">Normal</option>
                      <option value="Overweight">Overweight</option>
                      <option value="Obese">Obese</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Health Metrics + Health Conditions */}
              {activeSection === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Numeric Health Metrics */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">HbA1c Level</label>
                    <input
                      type="number"
                      name="HbA1c_level"
                      value={formData.HbA1c_level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      min="3" max="10" step="0.1" required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Blood Glucose Level</label>
                    <input
                      type="number"
                      name="blood_glucose_level"
                      value={formData.blood_glucose_level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      min="50" max="300" step="1" required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">HDL Cholesterol</label>
                    <input
                      type="number"
                      name="hdl_cholesterol"
                      value={formData.hdl_cholesterol}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      min="10" max="100" step="0.1" required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Triglycerides</label>
                    <input
                      type="number"
                      name="triglycerides"
                      value={formData.triglycerides}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      min="50" max="300" step="0.1" required
                    />
                  </div>

                  {/* Health Conditions */}
                  <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="hypertension"
                        checked={!!formData.hypertension}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-orange-600"
                      />
                      <span className="text-gray-700 font-semibold">Hypertension</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="heart_disease"
                        checked={!!formData.heart_disease}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-orange-600"
                      />
                      <span className="text-gray-700 font-semibold">Heart Disease</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="prediabetes"
                        checked={!!formData.prediabetes}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-orange-600"
                      />
                      <span className="text-gray-700 font-semibold">Prediabetes</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="high_blood_pressure"
                        checked={!!formData.high_blood_pressure}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-orange-600"
                      />
                      <span className="text-gray-700 font-semibold">High Blood Pressure</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Lifestyle Factors */}
              {activeSection === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Sleep Hours</label>
                    <input
                      type="number"
                      name="sleep_hours"
                      value={formData.sleep_hours}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      min="0" max="12" step="0.1" required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Physical Inactivity</label>
                    <input
                      type="checkbox"
                      name="physical_inactivity"
                      checked={!!formData.physical_inactivity}
                      onChange={handleCheckboxChange}
                      className="h-5 w-5 text-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Smoking History</label>
                    <select
                      name="smoking_history"
                      value={formData.smoking_history}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="never">Never</option>
                      <option value="former">Former</option>
                      <option value="current">Current</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Alcohol Use</label>
                    <select
                      name="alcohol_use"
                      value={formData.alcohol_use}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="None">None</option>
                      <option value="Occasional">Occasional</option>
                      <option value="Frequent">Frequent</option>
                    </select>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
          {activeSection > 0 && (
            <button
              type="button"
              onClick={handlePreviousSection}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all"
            >
              Previous
            </button>
          )}
          
          {activeSection < sections.length - 1 ? (
            <button
              type="button"
              onClick={handleNextSection}
              disabled={isNextDisabled()}
              className={`px-6 py-3 rounded-xl text-white transition-all ${
                isNextDisabled() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          ) : (
            <button
  type="submit"
  className={`px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 transition-all ${
    isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  disabled={loading || isSubmitDisabled()}
>
  {loading && <Loader2 className="animate-spin w-4 h-4" />}
  <span>Get Risk Assessment</span>
</button>

          )}
        </div>
      </form>
    </motion.div>
  );
};

export default DiabetesForm;
