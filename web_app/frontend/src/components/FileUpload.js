import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader } from 'lucide-react';

const FileUpload = ({ onFileUpload, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const name = file.name.toLowerCase();
    const mime = file.type;
    const isCsv = mime === 'text/csv' || name.endsWith('.csv');
    const isTxt = mime === 'text/plain' || name.endsWith('.txt');

    if (isCsv || isTxt) {
      setSelectedFile(file);
    } else {
      alert('Por favor selecciona un archivo CSV o TXT');
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Cargar Datos para Análisis
          </h2>
          <p className="text-slate-600">
            Sube un archivo CSV con datos de red para detectar posibles intrusiones
          </p>
        </div>

        {/* Drag and Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            onChange={handleChange}
            className="hidden"
            id="file-upload"
          />
          
          {!selectedFile ? (
            <div>
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 font-medium mb-2">
                Arrastra y suelta tu archivo CSV o TXT aquí
              </p>
              <p className="text-sm text-slate-500 mb-4">o</p>
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar archivo
              </label>
              <p className="text-xs text-slate-500 mt-4">
                Formatos soportados: CSV, TXT
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {selectedFile && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Analizar Datos
                </>
              )}
            </button>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">99.94%</div>
            <div className="text-sm text-slate-600">Precisión del Modelo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">GBM</div>
            <div className="text-sm text-slate-600">Gradient Boosting</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">KDD</div>
            <div className="text-sm text-slate-600">Dataset Entrenado</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Formato del archivo
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>El archivo debe ser CSV con las mismas características usadas en el entrenamiento</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Opcionalmente puede incluir la columna 'binario' con las etiquetas reales para evaluación</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>El modelo clasificará cada registro como Normal (0) o Ataque (1)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;

