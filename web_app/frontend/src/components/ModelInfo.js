import React from 'react';
import { Brain, Activity, TrendingUp, Layers, Settings, Award } from 'lucide-react';

const ModelInfo = ({ modelInfo }) => {
  const metrics = modelInfo.metrics || {};

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Model Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Información del Modelo
            </h2>
            <p className="text-slate-600">Gradient Boosting Classifier</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Estimadores</span>
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {modelInfo.n_estimators}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900">Learning Rate</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">
              {modelInfo.learning_rate?.toFixed(4)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-900">Max Depth</span>
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {modelInfo.max_depth}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-900">Features</span>
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {modelInfo.n_features}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {metrics.accuracy && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Métricas de Rendimiento
              </h2>
              <p className="text-slate-600">Evaluación en conjunto de prueba</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Accuracy */}
            <div className="relative">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {(metrics.accuracy * 100).toFixed(2)}%
                </div>
                <div className="text-sm font-medium text-slate-700 uppercase tracking-wide">
                  Accuracy
                </div>
                <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-1000"
                    style={{ width: `${metrics.accuracy * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ROC AUC */}
            {metrics.roc_auc && (
              <div className="relative">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {(metrics.roc_auc * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm font-medium text-slate-700 uppercase tracking-wide">
                    ROC AUC
                  </div>
                  <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-1000"
                      style={{ width: `${metrics.roc_auc * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* F1 Score */}
            {metrics.best_f1_cv && (
              <div className="relative">
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600 mb-2">
                    {(metrics.best_f1_cv * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm font-medium text-slate-700 uppercase tracking-wide">
                    F1 Score (CV)
                  </div>
                  <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-1000"
                      style={{ width: `${metrics.best_f1_cv * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raw Metrics */}
      {metrics.raw_metrics && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Reporte Completo
          </h3>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <pre className="text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono">
              {metrics.raw_metrics}
            </pre>
          </div>
        </div>
      )}

      {/* Model Description */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-600" />
          Acerca del Modelo
        </h3>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <strong>Gradient Boosting Machine (GBM)</strong> es un algoritmo de ensemble learning 
            que construye modelos de forma secuencial, donde cada nuevo modelo corrige los errores 
            del anterior.
          </p>
          <p>
            Este modelo ha sido entrenado con el dataset KDD para detectar intrusiones en redes, 
            clasificando el tráfico como normal o como un ataque.
          </p>
          <p className="pt-2 border-t border-blue-200">
            <strong>Ventajas:</strong> Alta precisión, manejo de datos no lineales, 
            resistente al overfitting con regularización adecuada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
