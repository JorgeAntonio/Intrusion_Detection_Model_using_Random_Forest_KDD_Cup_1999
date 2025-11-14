// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const apiStatus = document.getElementById('apiStatus');
const modelInfo = document.getElementById('modelInfo');
const refreshModel = document.getElementById('refreshModel');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');
const results = document.getElementById('results');
const loadingOverlay = document.getElementById('loadingOverlay');
const openDashboard = document.getElementById('openDashboard');

let selectedFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAPIStatus();
  loadModelInfo();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  refreshModel.addEventListener('click', loadModelInfo);
  fileInput.addEventListener('change', handleFileSelect);
  removeFile.addEventListener('click', clearFile);
  analyzeBtn.addEventListener('click', analyzeFile);
  openDashboard.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
  });

  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#667eea';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#d1d5db';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#d1d5db';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });
}

// Check API Status
async function checkAPIStatus() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      updateStatus('connected', 'Conectado');
    } else {
      updateStatus('error', 'Error de conexión');
    }
  } catch (error) {
    updateStatus('error', 'API no disponible');
    showError('No se puede conectar con el servidor. Asegúrate de que el backend esté ejecutándose en http://localhost:5000');
  }
}

function updateStatus(status, text) {
  apiStatus.className = `status ${status}`;
  apiStatus.querySelector('.status-text').textContent = text;
}

// Load Model Info
async function loadModelInfo() {
  try {
    modelInfo.innerHTML = '<div class="loading">Cargando información del modelo...</div>';
    
    const response = await fetch(`${API_URL}/model-info`);
    if (!response.ok) throw new Error('Error al cargar información del modelo');
    
    const data = await response.json();
    displayModelInfo(data);
  } catch (error) {
    modelInfo.innerHTML = '<div class="error-message">Error al cargar información del modelo</div>';
  }
}

function displayModelInfo(data) {
  const metrics = data.metrics || {};
  
  const html = `
    <div class="model-stats">
      <div class="stat-item">
        <div class="stat-label">Estimadores</div>
        <div class="stat-value">${data.n_estimators}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Max Depth</div>
        <div class="stat-value">${data.max_depth}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Learning Rate</div>
        <div class="stat-value">${data.learning_rate?.toFixed(4)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Features</div>
        <div class="stat-value">${data.n_features}</div>
      </div>
    </div>
    ${metrics.accuracy ? `
      <div class="metrics">
        <div class="metric-item">
          <span class="metric-label">Accuracy</span>
          <span class="metric-value">${(metrics.accuracy * 100).toFixed(2)}%</span>
        </div>
        ${metrics.roc_auc ? `
          <div class="metric-item">
            <span class="metric-label">ROC AUC</span>
            <span class="metric-value">${(metrics.roc_auc * 100).toFixed(2)}%</span>
          </div>
        ` : ''}
        ${metrics.best_f1_cv ? `
          <div class="metric-item">
            <span class="metric-label">F1-Score (CV)</span>
            <span class="metric-value">${(metrics.best_f1_cv * 100).toFixed(2)}%</span>
          </div>
        ` : ''}
      </div>
    ` : ''}
  `;
  
  modelInfo.innerHTML = html;
}

// File Handling
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
}

function handleFile(file) {
  if (!file.name.endsWith('.csv')) {
    showError('Por favor selecciona un archivo CSV');
    return;
  }
  
  selectedFile = file;
  fileName.textContent = file.name;
  fileInfo.style.display = 'flex';
  uploadArea.querySelector('.upload-label').style.display = 'none';
  analyzeBtn.disabled = false;
}

function clearFile() {
  selectedFile = null;
  fileInput.value = '';
  fileInfo.style.display = 'none';
  uploadArea.querySelector('.upload-label').style.display = 'flex';
  analyzeBtn.disabled = true;
  resultsSection.style.display = 'none';
}

// Analyze File
async function analyzeFile() {
  if (!selectedFile) return;
  
  showLoading(true);
  
  try {
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al analizar el archivo');
    }
    
    const data = await response.json();
    displayResults(data);
    resultsSection.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

// Display Results
function displayResults(data) {
  const { total_samples, prediction_summary, evaluation } = data;
  const attackPercentage = prediction_summary.attack_percentage;
  const isHighThreat = attackPercentage > 50;
  
  let html = `
    <div class="result-card">
      <div class="result-header">
        <span class="result-title">Resumen del Análisis</span>
        <span class="result-badge ${isHighThreat ? 'danger' : 'success'}">
          ${total_samples.toLocaleString()} muestras
        </span>
      </div>
      <div class="result-stats">
        <div class="result-stat">
          <div class="result-stat-value normal">${prediction_summary.normal.toLocaleString()}</div>
          <div class="result-stat-label">Normal</div>
          <div style="font-size: 11px; color: #10b981; font-weight: 600;">
            ${prediction_summary.normal_percentage.toFixed(1)}%
          </div>
        </div>
        <div class="result-stat">
          <div class="result-stat-value attack">${prediction_summary.attack.toLocaleString()}</div>
          <div class="result-stat-label">Ataques</div>
          <div style="font-size: 11px; color: #ef4444; font-weight: 600;">
            ${prediction_summary.attack_percentage.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Alert
  if (isHighThreat) {
    html += `
      <div class="alert danger">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div>
          <strong>Alto nivel de amenazas detectado</strong><br>
          Se detectaron ${prediction_summary.attack} ataques (${attackPercentage.toFixed(1)}%). 
          Se recomienda revisar los registros.
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="alert success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <div>
          <strong>Nivel de amenazas bajo</strong><br>
          El tráfico analizado muestra ${prediction_summary.normal} conexiones normales 
          (${prediction_summary.normal_percentage.toFixed(1)}%).
        </div>
      </div>
    `;
  }
  
  // Evaluation metrics if available
  if (evaluation) {
    html += `
      <div class="result-card">
        <div class="result-header">
          <span class="result-title">Métricas de Evaluación</span>
          <span class="result-badge success">${(evaluation.accuracy * 100).toFixed(2)}%</span>
        </div>
        <div class="metrics">
          <div class="metric-item">
            <span class="metric-label">Accuracy</span>
            <span class="metric-value">${(evaluation.accuracy * 100).toFixed(2)}%</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">ROC AUC</span>
            <span class="metric-value">${(evaluation.roc_curve.auc * 100).toFixed(2)}%</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">PR AUC</span>
            <span class="metric-value">${(evaluation.precision_recall_curve.auc * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    `;
  }
  
  results.innerHTML = html;
}

// Utility Functions
function showLoading(show) {
  loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showError(message) {
  results.innerHTML = `<div class="error-message">${message}</div>`;
  resultsSection.style.display = 'block';
}

// Save results to storage
function saveResults(data) {
  chrome.storage.local.set({
    lastAnalysis: {
      timestamp: Date.now(),
      data: data
    }
  });
}

// Load last results
function loadLastResults() {
  chrome.storage.local.get(['lastAnalysis'], (result) => {
    if (result.lastAnalysis) {
      const timeDiff = Date.now() - result.lastAnalysis.timestamp;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        displayResults(result.lastAnalysis.data);
        resultsSection.style.display = 'block';
      }
    }
  });
}
