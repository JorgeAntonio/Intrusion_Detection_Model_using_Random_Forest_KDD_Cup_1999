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
  
  // Display recent traffic
  if (stats.recentRequests && stats.recentRequests.length > 0) {
    displayTraffic(stats.recentRequests);
    trafficCount.textContent = `${stats.recentRequests.length} peticiones`;
  } else {
    trafficList.innerHTML = '<div class="no-traffic"><p>No hay tráfico reciente</p></div>';
    trafficCount.textContent = '0 peticiones';
  }
}

// Display attacks
function displayAttacks(attacks) {
  const allAttacks = [
    ...attacks.ddos.map(a => ({ ...a, type: 'DDoS' })),
    ...attacks.bruteForce.map(a => ({ ...a, type: 'Brute Force' })),
    ...attacks.suspicious.map(a => ({ ...a, type: 'Suspicious' }))
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
    const severityClass = attack.severity || 'low';
    const icon = getAttackIcon(attack.type);
    const time = formatTime(attack.timestamp);
    
    html += `
      <div class="attack-item ${severityClass}">
        <div class="attack-icon">${icon}</div>
        <div class="attack-details">
          <div class="attack-header">
            <span class="attack-type">${attack.type}</span>
            <span class="attack-time">${time}</span>
          </div>
          <div class="attack-target">${truncateUrl(attack.target)}</div>
          ${attack.requestCount ? `<div class="attack-meta">${attack.requestCount} peticiones</div>` : ''}
          ${attack.failureCount ? `<div class="attack-meta">${attack.failureCount} intentos fallidos</div>` : ''}
        </div>
        <div class="attack-severity">
          <span class="severity-badge ${severityClass}">${severityClass.toUpperCase()}</span>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  attacksContainer.innerHTML = html;
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
  chrome.runtime.sendMessage(
    { action: 'getNetworkStats' },
    (stats) => {
      chrome.runtime.sendMessage(
        { action: 'getAttacks' },
        (attacks) => {
          const data = {
            timestamp: new Date().toISOString(),
            stats: stats,
            attacks: attacks
          };
          
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `network-analysis-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      );
    }
  );
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
