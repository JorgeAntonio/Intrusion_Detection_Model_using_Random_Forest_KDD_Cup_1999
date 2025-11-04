// Background Service Worker for Chrome Extension

// Importar Network Monitor
importScripts('network-monitor.js');

// Inicializar monitor de red
let networkMonitor = null;

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Gradient Boosting Network Analyzer installed');
    
    // Set default settings
    chrome.storage.local.set({
      apiUrl: 'http://localhost:5000/api',
      notifications: true,
      monitoringEnabled: true,
      ddosThreshold: 100,
      bruteForceThreshold: 10
    });
    
    // Inicializar monitor
    initNetworkMonitor();
  } else if (details.reason === 'update') {
    // Reinicializar en actualizaciones
    initNetworkMonitor();
  }
});

// Inicializar monitor de red
function initNetworkMonitor() {
  if (!networkMonitor) {
    networkMonitor = new NetworkMonitor();
    console.log('Network Monitor started');
  }
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkAPI') {
    checkAPIConnection().then(sendResponse);
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'analyze') {
    analyzeData(request.data).then(sendResponse);
    return true;
  }
  
  if (request.action === 'notify') {
    showNotification(request.title, request.message, request.type);
  }
  
  // Nuevas acciones para monitoreo en tiempo real
  if (request.action === 'getNetworkStats') {
    if (networkMonitor) {
      sendResponse(networkMonitor.getStats());
    } else {
      sendResponse({ error: 'Monitor not initialized' });
    }
    return true;
  }
  
  if (request.action === 'getAttacks') {
    if (networkMonitor) {
      sendResponse(networkMonitor.getAttacks());
    } else {
      sendResponse({ error: 'Monitor not initialized' });
    }
    return true;
  }
  
  if (request.action === 'clearMonitor') {
    if (networkMonitor) {
      networkMonitor.clear();
      sendResponse({ success: true });
    }
    return true;
  }
  
  if (request.action === 'toggleMonitoring') {
    chrome.storage.local.get(['monitoringEnabled'], (result) => {
      const newState = !result.monitoringEnabled;
      chrome.storage.local.set({ monitoringEnabled: newState });
      
      if (newState && !networkMonitor) {
        initNetworkMonitor();
      }
      
      sendResponse({ enabled: newState });
    });
    return true;
  }
});

// Check API connection
async function checkAPIConnection() {
  try {
    const settings = await chrome.storage.local.get(['apiUrl']);
    const apiUrl = settings.apiUrl || 'http://localhost:5000/api';
    
    const response = await fetch(`${apiUrl}/health`);
    return {
      success: response.ok,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Analyze data
async function analyzeData(fileData) {
  try {
    const settings = await chrome.storage.local.get(['apiUrl']);
    const apiUrl = settings.apiUrl || 'http://localhost:5000/api';
    
    const response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      body: fileData
    });
    
    if (!response.ok) {
      throw new Error('Error en el análisis');
    }
    
    const result = await response.json();
    
    // Save to history
    saveToHistory(result);
    
    // Show notification if high threat
    if (result.prediction_summary.attack_percentage > 50) {
      showNotification(
        'Alto nivel de amenazas',
        `Se detectaron ${result.prediction_summary.attack} ataques`,
        'warning'
      );
    }
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Save analysis to history
async function saveToHistory(result) {
  const history = await chrome.storage.local.get(['analysisHistory']) || { analysisHistory: [] };
  const historyArray = history.analysisHistory || [];
  
  historyArray.unshift({
    timestamp: Date.now(),
    totalSamples: result.total_samples,
    normalCount: result.prediction_summary.normal,
    attackCount: result.prediction_summary.attack,
    accuracy: result.evaluation?.accuracy
  });
  
  // Keep only last 10 analyses
  if (historyArray.length > 10) {
    historyArray.pop();
  }
  
  await chrome.storage.local.set({ analysisHistory: historyArray });
}

// Show notification
async function showNotification(title, message, type = 'info') {
  const settings = await chrome.storage.local.get(['notifications']);
  
  if (settings.notifications === false) {
    return;
  }
  
  const iconUrl = type === 'warning' 
    ? 'icons/icon-warning.png' 
    : 'icons/icon48.png';
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: iconUrl,
    title: title,
    message: message,
    priority: type === 'warning' ? 2 : 1
  });
}

// Periodic API health check
setInterval(async () => {
  const result = await checkAPIConnection();
  
  // Update badge based on API status
  if (result.success) {
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
  } else {
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
  }
}, 60000); // Check every minute

// Context menu for quick analysis - Removed duplicate
// (Already defined in onInstalled listener above)

// Note: chrome.action.openPopup() doesn't work in Manifest V3 service workers
// Users must click the extension icon to open the popup

// Inicializar monitor al cargar
initNetworkMonitor();

console.log('Background service worker initialized');
