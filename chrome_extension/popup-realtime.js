// Popup Real-time - Monitoreo de tráfico en tiempo real

// DOM Elements
const monitoringToggle = document.getElementById('monitoringToggle');
const toggleLabel = document.getElementById('toggleLabel');
const refreshStats = document.getElementById('refreshStats');
const totalRequests = document.getElementById('totalRequests');
const suspiciousCount = document.getElementById('suspiciousCount');
const attacksContainer = document.getElementById('attacksContainer');
const trafficList = document.getElementById('trafficList');
const trafficCount = document.getElementById('trafficCount');
const clearAttacks = document.getElementById('clearAttacks');
const viewDashboard = document.getElementById('viewDashboard');
const exportData = document.getElementById('exportData');
const uptime = document.getElementById('uptime');
const mlPredictions = document.getElementById('mlPredictions');
const mlStatus = document.getElementById('mlStatus');
const threatLevel = document.getElementById('threatLevel');

let startTime = Date.now();
let updateInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadMonitoringState();
  updateStats();
  setupEventListeners();
  startAutoUpdate();
  updateUptime();
});

// Event Listeners
function setupEventListeners() {
  monitoringToggle.addEventListener('change', toggleMonitoring);
  refreshStats.addEventListener('click', updateStats);
  clearAttacks.addEventListener('click', clearAllAttacks);
  viewDashboard.addEventListener('click', openDashboard);
  exportData.addEventListener('click', exportNetworkData);
}

// Load monitoring state
function loadMonitoringState() {
  chrome.storage.local.get(['monitoringEnabled'], (result) => {
    const enabled = result.monitoringEnabled !== false;
    monitoringToggle.checked = enabled;
    toggleLabel.textContent = enabled ? 'Activo' : 'Inactivo';
  });
}

// Toggle monitoring
function toggleMonitoring() {
  const enabled = monitoringToggle.checked;
  
  chrome.runtime.sendMessage(
    { action: 'toggleMonitoring' },
    (response) => {
      toggleLabel.textContent = response.enabled ? 'Activo' : 'Inactivo';
      if (response.enabled) {
        updateStats();
      }
    }
  );
}

// Update statistics
function updateStats() {
  // Get network stats
  chrome.runtime.sendMessage(
    { action: 'getNetworkStats' },
    (stats) => {
      if (stats && !stats.error) {
        displayStats(stats);
      }
    }
  );
  
  // Get attacks
  chrome.runtime.sendMessage(
    { action: 'getAttacks' },
    (attacks) => {
      if (attacks && !attacks.error) {
        displayAttacks(attacks);
      }
    }
  );
}

// Display statistics
function displayStats(stats) {
  totalRequests.textContent = stats.totalRequests.toLocaleString();
  suspiciousCount.textContent = stats.suspiciousActivity.toLocaleString();
  
  // Display ML predictions count
  if (mlPredictions && stats.mlPredictions !== undefined) {
    mlPredictions.textContent = stats.mlPredictions.toLocaleString();
  }
  
  // Display ML status and threat level
  displayMLStatus();
  
  // Display recent traffic
  if (stats.recentRequests && stats.recentRequests.length > 0) {
    displayTraffic(stats.recentRequests);
    trafficCount.textContent = `${stats.recentRequests.length} peticiones`;
  } else {
    trafficList.innerHTML = '<div class="no-traffic"><p>No hay tráfico reciente</p></div>';
    trafficCount.textContent = '0 peticiones';
  }
}

// Display ML status and threat level
function displayMLStatus() {
  chrome.storage.local.get(['mlLastPrediction'], (result) => {
    if (result.mlLastPrediction && mlStatus && threatLevel) {
      const prediction = result.mlLastPrediction;
      const timeDiff = Date.now() - prediction.timestamp;
      const minutesAgo = Math.floor(timeDiff / 60000);
      
      mlStatus.textContent = minutesAgo < 5 ? 'Activo' : 'Esperando tráfico';
      mlStatus.className = minutesAgo < 5 ? 'ml-status active' : 'ml-status waiting';
      
      if (prediction.summary && threatLevel) {
        const level = prediction.summary.threat_level;
        const attackPercentage = prediction.summary.attack_percentage.toFixed(1);
        
        threatLevel.textContent = `${level.toUpperCase()} (${attackPercentage}% ataques)`;
        threatLevel.className = `threat-level ${level}`;
      }
    }
  });
}

// Display attacks
function displayAttacks(attacks) {
  const allAttacks = [
    ...attacks.ddos.map(a => ({ ...a, category: 'DDoS' })),
    ...attacks.bruteForce.map(a => ({ ...a, category: 'Brute Force' })),
    ...attacks.suspicious.map(a => ({ ...a, category: 'Suspicious' })),
    ...(attacks.mlDetected || []).map(a => ({ ...a, category: 'ML Detected' }))
  ];
  
  // Sort by timestamp (most recent first)
  allAttacks.sort((a, b) => b.timestamp - a.timestamp);
  
  if (allAttacks.length === 0) {
    attacksContainer.innerHTML = `
      <div class="no-attacks">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p>No se han detectado ataques</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="attacks-list">';
  
  allAttacks.slice(0, 10).forEach(attack => {
    const card = createAttackCard(attack);
    html += card.outerHTML;
  });
  
  html += '</div>';
  attacksContainer.innerHTML = html;
}

function createAttackCard(attack) {
  const card = document.createElement('div');
  card.className = `attack-card ${attack.severity || 'medium'}`;
  
  const time = new Date(attack.timestamp).toLocaleTimeString();
  const target = attack.target.length > 50 ? attack.target.substring(0, 50) + '...' : attack.target;
  
  // Si es un ataque detectado por ML, mostrar información adicional
  let extraInfo = '';
  if (attack.category === 'ML Detected') {
    extraInfo = `
      <div class="ml-info">
        <span class="ml-badge">🤖 ML</span>
        <span>Confianza: ${(attack.confidence * 100).toFixed(1)}%</span>
        <span>Prob. Ataque: ${(attack.attackProbability * 100).toFixed(1)}%</span>
      </div>
    `;
  }
  
  card.innerHTML = `
    <div class="attack-header">
      <span class="attack-type">${attack.category}</span>
      <span class="attack-time">${time}</span>
    </div>
    <div class="attack-target">${target}</div>
    ${extraInfo}
    <div class="attack-severity">
      <span class="severity-badge ${attack.severity}">${attack.severity || 'medium'}</span>
    </div>
  `;
  
  return card;
}

// Display traffic
function displayTraffic(requests) {
  if (requests.length === 0) {
    trafficList.innerHTML = '<div class="no-traffic"><p>No hay tráfico reciente</p></div>';
    return;
  }
  
  let html = '<div class="traffic-items">';
  
  requests.slice(-20).reverse().forEach(req => {
    const method = req.method || 'GET';
    const methodClass = method.toLowerCase();
    const time = formatTime(req.timestamp);
    const domain = extractDomain(req.url);
    
    html += `
      <div class="traffic-item">
        <span class="method-badge ${methodClass}">${method}</span>
        <div class="traffic-details">
          <div class="traffic-domain">${domain}</div>
          <div class="traffic-time">${time}</div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  trafficList.innerHTML = html;
}

// Get attack icon
function getAttackIcon(type) {
  const icons = {
    'DDoS': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
    'Brute Force': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>`,
    'Suspicious': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`
  };
  
  return icons[type] || icons['Suspicious'];
}

// Clear all attacks
function clearAllAttacks() {
  if (confirm('¿Limpiar todos los ataques detectados?')) {
    chrome.runtime.sendMessage(
      { action: 'clearMonitor' },
      () => {
        updateStats();
      }
    );
  }
}

// Open dashboard
function openDashboard() {
  chrome.tabs.create({ url: 'http://localhost:3000' });
}

// Export network data
function exportNetworkData() {
  console.log('Exportando datos de tráfico...');
  
  // Timeout para detectar si no hay respuesta
  let responseReceived = false;
  const timeout = setTimeout(() => {
    if (!responseReceived) {
      console.error('Timeout: No se recibió respuesta del background');
      alert('Error: El background script no responde. Intenta recargar la extensión.');
    }
  }, 5000); // 5 segundos de timeout
  
  try {
    chrome.runtime.sendMessage(
      { action: 'exportTrafficData' },
      (data) => {
        responseReceived = true;
        clearTimeout(timeout);
        
        console.log('Respuesta recibida:', data);
        
        if (chrome.runtime.lastError) {
          console.error('Error en runtime:', chrome.runtime.lastError);
          alert('Error al exportar: ' + chrome.runtime.lastError.message + '\n\nIntenta:\n1. Recargar la extensión\n2. Navegar por sitios web primero\n3. Verificar que el monitoreo esté activo');
          return;
        }
        
        if (data && data.error) {
          console.error('Error en exportación:', data.error);
          alert('Error: ' + data.error);
          return;
        }
        
        if (data && data.traffic) {
          console.log(`Exportando ${data.traffic.length} requests`);
          
          if (data.traffic.length === 0) {
            alert('No hay tráfico capturado aún.\n\nPara generar tráfico:\n1. Asegúrate de que el monitoreo esté ACTIVO\n2. Navega por algunos sitios web\n3. Espera unos segundos\n4. Intenta exportar nuevamente');
            return;
          }
          
          // Exportar JSON
          const jsonData = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonData], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `traffic-export-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // También exportar como CSV HTTP (datos raw)
          exportAsCSV(data.traffic);
          
          // Exportar CSV en formato KDD para el modelo ML
          exportAsKDDCSV(data.traffic);
          
          console.log('Exportación completada');
          alert(`✅ Exportación exitosa!\n\n${data.traffic.length} requests exportados\n\nArchivos descargados:\n- traffic-export-[timestamp].json (Datos completos)\n- traffic-data-[timestamp].csv (HTTP raw)\n- traffic-kdd-[timestamp].csv (Para modelo ML)`);
        } else {
          console.warn('No hay datos para exportar');
          alert('No hay datos de tráfico para exportar.\n\nAsegúrate de que:\n1. El monitoreo esté activo\n2. Hayas navegado por sitios web\n3. Haya tráfico capturado');
        }
      }
    );
  } catch (error) {
    clearTimeout(timeout);
    console.error('Error al enviar mensaje:', error);
    alert('Error inesperado: ' + error.message);
  }
}

// Export traffic as CSV for ML analysis (HTTP raw data)
function exportAsCSV(traffic) {
  if (!traffic || traffic.length === 0) {
    console.warn('No hay datos de tráfico para exportar como CSV');
    return;
  }
  
  try {
    console.log(`Exportando ${traffic.length} requests como CSV HTTP`);
    
    // Headers CSV
    const headers = ['url', 'method', 'statusCode', 'timestamp', 'duration', 'requestSize', 'responseSize', 'domain'];
    let csv = headers.join(',') + '\n';
    
    // Data rows
    traffic.forEach(req => {
      const row = [
        `"${(req.url || '').replace(/"/g, '""')}"`, // Escapar comillas dobles
        req.method || '',
        req.statusCode || '',
        req.timestamp || '',
        req.duration || '',
        req.requestSize || '',
        req.responseSize || '',
        req.domain || ''
      ];
      csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-data-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('CSV HTTP exportado exitosamente');
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    alert('Error al exportar CSV: ' + error.message);
  }
}

// Export traffic as KDD format CSV for ML model
async function exportAsKDDCSV(traffic) {
  if (!traffic || traffic.length === 0) {
    console.warn('No hay datos de tráfico para exportar como KDD CSV');
    return;
  }
  
  try {
    console.log(`Convirtiendo ${traffic.length} requests a formato KDD...`);
    
    // Enviar al backend para convertir a KDD
    const response = await fetch('http://localhost:5000/api/predict-realtime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ traffic: traffic })
    });
    
    if (!response.ok) {
      throw new Error('Error al convertir a formato KDD');
    }
    
    const result = await response.json();
    
    // El backend ya tiene las features KDD, pero necesitamos exportarlas
    // Por ahora, crear un CSV con las predicciones y probabilidades
    console.log('Generando CSV en formato KDD...');
    
    // Crear endpoint para exportar features KDD
    const exportResponse = await fetch('http://localhost:5000/api/export-kdd-features', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ traffic: traffic })
    });
    
    if (!exportResponse.ok) {
      console.warn('Endpoint de exportación KDD no disponible, usando predicciones');
      // Fallback: exportar solo las predicciones
      exportPredictionsCSV(result.predictions);
      return;
    }
    
    const kddData = await exportResponse.text();
    
    const blob = new Blob([kddData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-kdd-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('CSV KDD exportado exitosamente');
  } catch (error) {
    console.error('Error al exportar KDD CSV:', error);
    console.warn('No se pudo exportar en formato KDD, el backend puede no estar disponible');
  }
}

// Export predictions as CSV (fallback)
function exportPredictionsCSV(predictions) {
  try {
    const headers = ['url', 'prediction', 'confidence', 'attack_probability', 'normal_probability'];
    let csv = headers.join(',') + '\n';
    
    predictions.forEach(pred => {
      const row = [
        `"${(pred.url || '').replace(/"/g, '""')}"`,
        pred.prediction || '',
        pred.confidence || '',
        pred.attack_probability || '',
        pred.normal_probability || ''
      ];
      csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-predictions-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('CSV de predicciones exportado');
  } catch (error) {
    console.error('Error al exportar predicciones:', error);
  }
}

// Start auto-update
function startAutoUpdate() {
  updateInterval = setInterval(() => {
    updateStats();
  }, 2000); // Update every 2 seconds
}

// Update uptime
function updateUptime() {
  setInterval(() => {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    uptime.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }, 1000);
}

// Utility functions
function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 1000) return 'Ahora';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url.substring(0, 30) + '...';
  }
}

function truncateUrl(url, maxLength = 40) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

// Cleanup on close
window.addEventListener('beforeunload', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
