import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Heart
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

const PredictionResult = ({ prediction, onReset }) => {
  const getRiskLevel = (probability) => {
    if (probability < 0.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
    if (probability < 0.6) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
  };

  const risk = getRiskLevel(prediction.probability);
  const percentage = (prediction.probability * 100).toFixed(1);

  const recommendations = [
    {
      icon: Activity,
      title: 'Regular Exercise',
      description: 'Aim for 150 minutes of moderate exercise per week',
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Balanced Diet',
      description: 'Focus on whole foods, fiber, and limit processed sugars',
      color: 'green'
    },
    {
      icon: TrendingDown,
      title: 'Weight Management',
      description: 'Maintain healthy BMI through diet and exercise',
      color: 'purple'
    }
  ];

  //  PDF Generation
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Diabetes Risk Assessment', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Prediction Result: ${prediction.prediction === 1 ? 'At Risk - Positive' : 'Low Risk - Negative'}`, 20, 40);
    doc.text(`Probability: ${percentage}%`, 20, 50);
    doc.text(`Risk Level: ${risk.level}`, 20, 60);

    doc.text('Recommended Actions:', 20, 80);
    recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec.title} - ${rec.description}`, 25, 90 + index * 10);
    });

    doc.text('Disclaimer: This assessment is for educational purposes only. Please consult with healthcare professionals for medical advice.', 20, 140, { maxWidth: 170 });

    doc.save('Diabetes_Risk_Assessment.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          {risk.level === 'Low' ? (
            <CheckCircle className="w-10 h-10 text-green-300" />
          ) : risk.level === 'Moderate' ? (
            <AlertTriangle className="w-10 h-10 text-yellow-300" />
          ) : (
            <Activity className="w-10 h-10 text-red-300" />
          )}
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Diabetes Risk Assessment</h2>
        <p className="text-blue-100">Based on your health profile</p>
      </div>

      <div className="p-8">
        {/* Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`border-2 ${risk.border} ${risk.bg} rounded-2xl p-6 text-center mb-8`}
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`text-4xl font-bold ${risk.color}`}>
              {percentage}%
            </div>
            <div className="text-left">
              <div className={`text-xl font-semibold ${risk.color}`}>
                {risk.level} Risk
              </div>
              <div className="text-sm text-gray-600">
                Probability of developing diabetes
              </div>
            </div>
          </div>
          
          {/* Risk Meter */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.5, duration: 1 }}
              className={`h-3 rounded-full ${
                risk.level === 'Low' ? 'bg-green-500' :
                risk.level === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Prediction Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Prediction Result</span>
            </h3>
            <p className={`text-lg font-bold ${
              prediction.prediction === 1 ? 'text-red-600' : 'text-green-600'
            }`}>
              {prediction.prediction === 1 ? 'At Risk - Positive' : 'Low Risk - Negative'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>Confidence Level</span>
            </h3>
            <p className="text-lg font-bold text-blue-600">
              {Math.max(prediction.probability, 1 - prediction.probability).toFixed(3)}
            </p>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full bg-${rec.color}-100 flex items-center justify-center mx-auto mb-3`}>
                  <rec.icon className={`w-6 h-6 text-${rec.color}-600`} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{rec.title}</h4>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onReset}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
          
          <button
            onClick={generatePDF} 
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-medium flex items-center justify-center space-x-2"
          >
            <Heart className="w-4 h-4" />
            <span>Save Results</span>
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          This assessment is for educational purposes only. Please consult with healthcare professionals for medical advice.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default PredictionResult;
