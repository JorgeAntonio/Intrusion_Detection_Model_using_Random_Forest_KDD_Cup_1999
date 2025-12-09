import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Brain, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  BarChart3
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100">
      <div className="background-ia absolute inset-0 opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_left,#60a5fa,transparent_45%),radial-gradient(circle_at_bottom_right,#a78bfa,transparent_40%)] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-900/70 border-b border-white/5 shadow-lg shadow-blue-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/30 ring-1 ring-white/10">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    MODELOS DE CLASIFICACIÓN DE TRÁFICO DE RED DE INFORMACIÓN CON MACHINE LEARNING
                  </h1>
                  {/* <p className="text-sm text-slate-200/80">
                    Sistema de detección de intrusos con IA
                  </p> */}
                </div>
              </div>
              
              {modelInfo && (
                <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-lg ring-1 ring-emerald-400/40 shadow-inner shadow-emerald-500/10">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm font-medium text-emerald-100">
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
            <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 flex items-start space-x-3 shadow-lg shadow-red-900/20 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-300 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-100">Error</h3>
                <p className="text-sm text-red-200 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white/5 rounded-2xl shadow-lg shadow-blue-900/30 border border-white/10 p-2 inline-flex space-x-2 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/30 ring-1 ring-white/50 scale-[1.02]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Cargar Datos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('model')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'model'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/30 ring-1 ring-white/50 scale-[1.02]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Info del Modelo</span>
            </button>
            
            {predictions && (
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'results'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/30 ring-1 ring-white/50 scale-[1.02]'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Resultados</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 gap-6">
            {activeTab === 'upload' && (
              <div className="bg-white/5 rounded-2xl border border-white/10 shadow-2xl shadow-blue-900/30 backdrop-blur-xl p-6">
                <FileUpload 
                  onFileUpload={handleFileUpload} 
                  loading={loading}
                />
              </div>
            )}
            
            {activeTab === 'model' && modelInfo && (
              <div className="bg-white/5 rounded-2xl border border-white/10 shadow-2xl shadow-blue-900/30 backdrop-blur-xl p-6">
                <ModelInfo modelInfo={modelInfo} />
              </div>
            )}
            
            {activeTab === 'results' && predictions && (
              <div className="bg-white/5 rounded-2xl border border-white/10 shadow-2xl shadow-blue-900/30 backdrop-blur-xl p-6">
                <Dashboard predictions={predictions} />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900/80 border-t border-white/5 mt-12 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-slate-200/80">
              Modelo entrenado Gradient Boosting con Machine Learning para detección de intrusiones en redes de Información • KDD Dataset
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
