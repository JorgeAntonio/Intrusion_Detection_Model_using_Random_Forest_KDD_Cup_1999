import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = ({ predictions }) => {
  const { prediction_summary, evaluation, total_samples } = predictions;
  const hasAttacks = prediction_summary.attack > 0;

  // Datos para gráfico de pie
  const pieData = [
    { name: 'Normal', value: prediction_summary.normal, color: '#10b981' },
    { name: 'Ataque', value: prediction_summary.attack, color: '#ef4444' }
  ];

  // Datos para matriz de confusión (si hay evaluación)
  const confusionData = evaluation ? [
    {
      name: 'True Normal',
      'Pred Normal': evaluation.confusion_matrix[0][0],
      'Pred Attack': evaluation.confusion_matrix[0][1]
    },
    {
      name: 'True Attack',
      'Pred Normal': evaluation.confusion_matrix[1][0],
      'Pred Attack': evaluation.confusion_matrix[1][1]
    }
  ] : null;

  // Datos para curva ROC
  const rocData = evaluation?.roc_curve ? 
    evaluation.roc_curve.fpr.map((fpr, idx) => ({
      fpr: fpr,
      tpr: evaluation.roc_curve.tpr[idx]
    })).filter((_, idx) => idx % 50 === 0) // Reducir puntos para mejor rendimiento
    : null;

  // Datos para Precision-Recall
  const prData = evaluation?.precision_recall_curve ?
    evaluation.precision_recall_curve.recall.map((recall, idx) => ({
      recall: recall,
      precision: evaluation.precision_recall_curve.precision[idx]
    })).filter((_, idx) => idx % 50 === 0)
    : null;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {total_samples.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">Total de Muestras</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {prediction_summary.normal.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">
            Tráfico Normal ({prediction_summary.normal_percentage.toFixed(1)}%)
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">
            {prediction_summary.attack.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">
            Ataques Detectados ({prediction_summary.attack_percentage.toFixed(1)}%)
          </div>
        </div>

        {evaluation && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {(evaluation.accuracy * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-slate-600">Precisión del Modelo</div>
          </div>
        )}
      </div>

      {/* Prediction Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Distribución de Predicciones
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {confusionData && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Matriz de Confusión
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={confusionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Pred Normal" fill="#10b981" />
                <Bar dataKey="Pred Attack" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ROC and PR Curves */}
      {evaluation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rocData && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Curva ROC
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                AUC: {evaluation.roc_curve.auc.toFixed(4)}
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rocData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="fpr" 
                    label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="tpr" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    data={[{fpr: 0, tpr: 0}, {fpr: 1, tpr: 1}]}
                    dataKey="tpr"
                    stroke="#94a3b8" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {prData && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Curva Precision-Recall
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                AUC: {evaluation.precision_recall_curve.auc.toFixed(4)}
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="recall" 
                    label={{ value: 'Recall', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Precision', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="precision" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Classification Report */}
      {evaluation?.classification_report && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Reporte de Clasificación
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Clase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Precision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Recall
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    F1-Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Support
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {Object.entries(evaluation.classification_report)
                  .filter(([key]) => !['accuracy', 'macro avg', 'weighted avg'].includes(key))
                  .map(([className, metrics]) => (
                    <tr key={className}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {className === '0' ? 'Normal' : className === '1' ? 'Ataque' : className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {(metrics.precision * 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {(metrics.recall * 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {(metrics['f1-score'] * 100).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {metrics.support}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Alert */}
      <div className={`rounded-xl border p-6 ${
        hasAttacks
          ? 'bg-red-50 border-red-200'
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-start space-x-3">
          {hasAttacks ? (
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
          ) : (
            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
          )}
          <div>
            <h3 className={`font-semibold mb-2 ${
              hasAttacks ? 'text-red-900' : 'text-green-900'
            }`}>
              {hasAttacks
                ? '⚠️ Alto nivel de amenazas detectado'
                : '✅ Nivel de amenazas bajo'}
            </h3>
            <p className={`text-sm ${
              hasAttacks ? 'text-red-800' : 'text-green-800'
            }`}>
              {hasAttacks
                ? `Se detectaron ${prediction_summary.attack} ataques (${prediction_summary.attack_percentage.toFixed(1)}% del tráfico). Se recomienda revisar los registros y tomar medidas de seguridad.`
                : `El tráfico analizado muestra ${prediction_summary.normal} conexiones normales (${prediction_summary.normal_percentage.toFixed(1)}%). El sistema está operando dentro de parámetros normales.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
