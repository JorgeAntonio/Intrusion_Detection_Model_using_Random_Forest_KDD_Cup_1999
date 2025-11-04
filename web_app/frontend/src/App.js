import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Brain, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  BarChart3,
  TrendingUp,
  Shield,
  AlertTriangle,
  FileText,
  Loader
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import ModelInfo from './components/ModelInfo';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [modelInfo, setModelInfo] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/model-info`);
      setModelInfo(response.data);
    } catch (err) {
      console.error('Error al cargar información del modelo:', err);
      setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose.');
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPredictions(response.data);
      setActiveTab('results');
    } catch (err) {
      console.error('Error al procesar archivo:', err);
      setError(err.response?.data?.error || 'Error al procesar el archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Gradient Boosting Dashboard
                </h1>
                <p className="text-sm text-slate-600">
                  Sistema de detección de intrusiones con Machine Learning
                </p>
              </div>
            </div>
            
            {modelInfo && (
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Modelo cargado
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1 inline-flex space-x-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-500 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Cargar Datos</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('model')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'model'
                ? 'bg-blue-500 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Info del Modelo</span>
            </div>
          </button>
          
          {predictions && (
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Resultados</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <FileUpload 
            onFileUpload={handleFileUpload} 
            loading={loading}
          />
        )}
        
        {activeTab === 'model' && modelInfo && (
          <ModelInfo modelInfo={modelInfo} />
        )}
        
        {activeTab === 'results' && predictions && (
          <Dashboard predictions={predictions} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600">
            Gradient Boosting Machine para detección de intrusiones en redes • KDD Dataset
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
