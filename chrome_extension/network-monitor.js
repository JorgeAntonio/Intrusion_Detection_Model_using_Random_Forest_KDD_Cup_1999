/**
 * Network Monitor - Análisis de tráfico en tiempo real
 * Detecta ataques DDoS, Fuerza Bruta y patrones anómalos
 */

class NetworkMonitor {
  constructor() {
    this.requests = [];
    this.requestDetails = new Map(); // Almacenar detalles completos de requests
    this.attackPatterns = {
      ddos: [],
      bruteForce: [],
      portScan: [],
      suspicious: [],
      mlDetected: [] // Ataques detectados por ML
    };
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      mlPredictions: 0,
      lastUpdate: Date.now()
    };
    this.mlEnabled = true; // Flag para habilitar/deshabilitar ML
    this.mlBatchSize = 10; // Enviar al ML cada N requests
    this.mlApiUrl = 'http://localhost:5000/api/predict-realtime';
    
    // Configuración de detección (UMBRALES REDUCIDOS PARA PRUEBAS)
    this.config = {
      ddosThreshold: 5,          // Peticiones por segundo (reducido para pruebas)
      ddosTimeWindow: 1000,      // 1 segundo
      bruteForceThreshold: 3,    // Intentos fallidos (reducido para pruebas)
      bruteForceTimeWindow: 60000, // 1 minuto
      suspiciousPatterns: [
        /admin/i,
        /login/i,
        /password/i,
        /\.env/i,
        /\.git/i,
        /wp-admin/i,
        /phpmyadmin/i,
        /api/i  // Agregar para detectar /api/login
      ]
    };
    
    this.init();
  }
  
  init() {
    console.log('🔧 Initializing Network Monitor...');
    
    // Verificar que webRequest esté disponible
    if (!chrome.webRequest) {
      console.error('❌ chrome.webRequest is not available!');
      console.error('   Check manifest.json permissions');
      return;
    }
    
    console.log('✅ chrome.webRequest is available');
    
    // Escuchar peticiones de red
    try {
      chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
          console.log('📡 Request detected:', details.url);
          this.onRequest(details);
        },
        { urls: ["<all_urls>"] },
        ["requestBody"]
      );
      console.log('✅ onBeforeRequest listener added');
    } catch (e) {
      console.error('❌ Error adding onBeforeRequest listener:', e);
    }
    
    // Escuchar respuestas
    try {
      chrome.webRequest.onCompleted.addListener(
        (details) => this.onResponse(details),
        { urls: ["<all_urls>"] }
      );
      console.log('✅ onCompleted listener added');
    } catch (e) {
      console.error('❌ Error adding onCompleted listener:', e);
    }
    
    // Escuchar errores
    try {
      chrome.webRequest.onErrorOccurred.addListener(
        (details) => this.onError(details),
        { urls: ["<all_urls>"] }
      );
      console.log('✅ onErrorOccurred listener added');
    } catch (e) {
      console.error('❌ Error adding onErrorOccurred listener:', e);
    }
    
    // Análisis periódico
    chrome.alarms.create('analyzeTraffic', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'analyzeTraffic') {
        this.analyzeTraffic();
      }
    });
    
    console.log('✅ Network Monitor initialized successfully!');
  }
  
  onRequest(details) {
    const startTime = Date.now();
    
    const request = {
      id: details.requestId,
      url: details.url,
      method: details.method,
      type: details.type,
      timestamp: details.timeStamp,
      tabId: details.tabId,
      initiator: details.initiator,
      startTime: startTime
    };
    
    // Almacenar detalles completos para ML
    this.requestDetails.set(details.requestId, {
      url: details.url,
      method: details.method,
      timestamp: details.timeStamp,
      startTime: startTime,
      requestSize: this.estimateRequestSize(details),
      domain: this.extractDomain(details.url)
    });
    
    this.requests.push(request);
    this.stats.totalRequests++;
    
    // Mantener solo últimos 1000 requests
    if (this.requests.length > 1000) {
      this.requests.shift();
    }
    
    // Limpiar requestDetails antiguos
    if (this.requestDetails.size > 1000) {
      const oldestKey = this.requestDetails.keys().next().value;
      this.requestDetails.delete(oldestKey);
    }
    
    // Detección inmediata con reglas
    this.detectDDoS(request);
    this.detectSuspiciousPatterns(request);
    
    // Actualizar badge
    this.updateBadge();
  }
  
  onResponse(details) {
    // Actualizar detalles del request con información de respuesta
    if (this.requestDetails.has(details.requestId)) {
      const requestInfo = this.requestDetails.get(details.requestId);
      requestInfo.statusCode = details.statusCode;
      requestInfo.duration = Date.now() - requestInfo.startTime;
      requestInfo.responseSize = this.estimateResponseSize(details);
      
      // Detectar intentos de fuerza bruta (401, 403)
      if (details.statusCode === 401 || details.statusCode === 403) {
        this.detectBruteForce(details);
      }
      
      // Enviar al ML si tenemos suficientes requests
      if (this.mlEnabled && this.requestDetails.size >= this.mlBatchSize) {
        this.sendToMLModel();
      }
    }
  }
  
  onError(details) {
    console.log('Request error:', details.error);
  }
  
  // Detección de DDoS
  detectDDoS(request) {
    const now = Date.now();
    const timeWindow = this.config.ddosTimeWindow;
    
    // Filtrar requests recientes del mismo origen
    const recentRequests = this.requests.filter(r => 
      now - r.timestamp < timeWindow &&
      this.extractDomain(r.url) === this.extractDomain(request.url)
    );
    
    if (recentRequests.length > this.config.ddosThreshold) {
      const attack = {
        type: 'DDoS',
        target: this.extractDomain(request.url),
        requestCount: recentRequests.length,
        timestamp: now,
        severity: 'high'
      };
      
      this.attackPatterns.ddos.push(attack);
      this.stats.suspiciousActivity++;
      
      // Notificar
      this.notifyAttack(attack);
      
      console.warn('DDoS detected:', attack);
    }
  }
  
  // Detección de Fuerza Bruta
  detectBruteForce(details) {
    const now = Date.now();
    const timeWindow = this.config.bruteForceTimeWindow;
    const url = details.url;
    
    // Buscar patrones de login/auth
    const isAuthEndpoint = /login|auth|signin|password/i.test(url);
    
    if (!isAuthEndpoint) return;
    
    // Contar fallos recientes en el mismo endpoint
    const recentFailures = this.attackPatterns.bruteForce.filter(a =>
      now - a.timestamp < timeWindow &&
      a.target === url
    );
    
    const attack = {
      type: 'Brute Force',
      target: url,
      failureCount: recentFailures.length + 1,
      timestamp: now,
      statusCode: details.statusCode,
      severity: recentFailures.length > 5 ? 'high' : 'medium'
    };
    
    this.attackPatterns.bruteForce.push(attack);
    
    if (recentFailures.length >= this.config.bruteForceThreshold) {
      this.stats.suspiciousActivity++;
      this.notifyAttack(attack);
      console.warn('Brute Force detected:', attack);
    }
  }
  
  // Detección de patrones sospechosos
  detectSuspiciousPatterns(request) {
    const url = request.url.toLowerCase();
    
    for (const pattern of this.config.suspiciousPatterns) {
      if (pattern.test(url)) {
        const attack = {
          type: 'Suspicious Pattern',
          target: url,
          pattern: pattern.source,
          timestamp: Date.now(),
          severity: 'low'
        };
        
        this.attackPatterns.suspicious.push(attack);
        console.log('Suspicious pattern detected:', attack);
        break;
      }
    }
  }
  
  // Análisis periódico del tráfico
  analyzeTraffic() {
    const now = Date.now();
    const last5Minutes = now - (5 * 60 * 1000);
    
    // Limpiar ataques antiguos
    this.cleanOldAttacks(last5Minutes);
    
    // Estadísticas
    const recentRequests = this.requests.filter(r => r.timestamp > last5Minutes);
    
    const analysis = {
      totalRequests: recentRequests.length,
      requestsPerMinute: recentRequests.length / 5,
      uniqueDomains: new Set(recentRequests.map(r => this.extractDomain(r.url))).size,
      ddosAttacks: this.attackPatterns.ddos.filter(a => a.timestamp > last5Minutes).length,
      bruteForceAttacks: this.attackPatterns.bruteForce.filter(a => a.timestamp > last5Minutes).length,
      suspiciousPatterns: this.attackPatterns.suspicious.filter(a => a.timestamp > last5Minutes).length
    };
    
    // Guardar análisis
    chrome.storage.local.set({ 
      networkAnalysis: analysis,
      lastAnalysis: now
    });
    
    console.log('Traffic analysis:', analysis);
  }
  
  // Notificar ataque detectado
  notifyAttack(attack) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: `⚠️ ${attack.type} Detectado`,
      message: `Target: ${attack.target}\nSeverity: ${attack.severity}`,
      priority: 2
    });
    
    // Actualizar badge con alerta
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#000' });
  }
  
  // Actualizar badge con contador
  updateBadge() {
    const activeAttacks = 
      this.attackPatterns.ddos.length +
      this.attackPatterns.bruteForce.length;
    
    if (activeAttacks > 0) {
      chrome.action.setBadgeText({ text: activeAttacks.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#000' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }
  
  // Limpiar ataques antiguos
  cleanOldAttacks(threshold) {
    this.attackPatterns.ddos = this.attackPatterns.ddos.filter(a => a.timestamp > threshold);
    this.attackPatterns.bruteForce = this.attackPatterns.bruteForce.filter(a => a.timestamp > threshold);
    this.attackPatterns.suspicious = this.attackPatterns.suspicious.filter(a => a.timestamp > threshold);
  }
  
  // Extraer dominio de URL
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  }
  
  // Estimar tamaño de request
  estimateRequestSize(details) {
    // Estimación aproximada basada en URL y método
    let size = details.url.length;
    if (details.requestBody) {
      if (details.requestBody.raw) {
        size += details.requestBody.raw.reduce((acc, item) => acc + (item.bytes?.byteLength || 0), 0);
      }
      if (details.requestBody.formData) {
        size += JSON.stringify(details.requestBody.formData).length;
      }
    }
    return size;
  }
  
  // Estimar tamaño de response
  estimateResponseSize(details) {
    // Chrome no proporciona responseSize directamente en webRequest
    // Estimación aproximada basada en headers
    let size = 0;
    if (details.responseHeaders) {
      const contentLength = details.responseHeaders.find(h => h.name.toLowerCase() === 'content-length');
      if (contentLength) {
        size = parseInt(contentLength.value) || 0;
      }
    }
    return size || 1000; // Default 1KB si no se puede determinar
  }
  
  // Enviar tráfico al modelo ML para predicción
  async sendToMLModel() {
    if (!this.mlEnabled || this.requestDetails.size === 0) return;
    
    try {
      // Preparar datos para el modelo
      const trafficData = Array.from(this.requestDetails.values())
        .filter(req => req.statusCode !== undefined) // Solo requests completados
        .slice(-this.mlBatchSize); // Últimos N requests
      
      if (trafficData.length === 0) return;
      
      console.log(`🤖 Enviando ${trafficData.length} requests al modelo ML...`);
      
      const response = await fetch(this.mlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ traffic: trafficData })
      });
      
      if (!response.ok) {
        console.error('❌ Error en predicción ML:', response.statusText);
        return;
      }
      
      const result = await response.json();
      this.processMLPredictions(result);
      
    } catch (error) {
      console.error('❌ Error al conectar con modelo ML:', error);
      // No deshabilitar ML, solo loggear el error
    }
  }
  
  // Procesar predicciones del modelo ML
  processMLPredictions(result) {
    console.log('🤖 Predicciones ML recibidas:', result.summary);
    
    this.stats.mlPredictions += result.total_requests;
    
    // Procesar cada predicción
    result.predictions.forEach(pred => {
      if (pred.prediction === 'attack' && pred.attack_probability > 0.7) {
        const attack = {
          type: 'ML Detected Attack',
          target: pred.url,
          confidence: pred.confidence,
          attackProbability: pred.attack_probability,
          timestamp: Date.now(),
          severity: pred.attack_probability > 0.9 ? 'critical' : 'high'
        };
        
        this.attackPatterns.mlDetected.push(attack);
        this.stats.suspiciousActivity++;
        
        // Notificar ataque detectado por ML
        this.notifyMLAttack(attack);
        
        console.warn('🚨 Ataque detectado por ML:', attack);
      }
    });
    
    // Guardar resumen en storage
    chrome.storage.local.set({
      mlLastPrediction: {
        timestamp: Date.now(),
        summary: result.summary,
        threatLevel: result.summary.threat_level
      }
    });
    
    // Actualizar badge si hay amenazas
    if (result.summary.threat_level === 'high') {
      this.updateBadge();
    }
  }
  
  // Notificar ataque detectado por ML
  notifyMLAttack(attack) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: `🤖 ${attack.type}`,
      message: `Target: ${attack.target}\nConfianza: ${(attack.confidence * 100).toFixed(1)}%\nProbabilidad de ataque: ${(attack.attackProbability * 100).toFixed(1)}%`,
      priority: 2
    });
    
    // Actualizar badge
    chrome.action.setBadgeText({ text: '🤖' });
    chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
  }
  
  // Obtener estadísticas
  getStats() {
    return {
      ...this.stats,
      attacks: {
        ddos: this.attackPatterns.ddos.length,
        bruteForce: this.attackPatterns.bruteForce.length,
        suspicious: this.attackPatterns.suspicious.length,
        mlDetected: this.attackPatterns.mlDetected.length
      },
      recentRequests: this.requests.slice(-50) // Últimas 50
    };
  }
  
  // Obtener ataques detectados
  getAttacks() {
    return {
      ddos: this.attackPatterns.ddos.slice(-10),
      bruteForce: this.attackPatterns.bruteForce.slice(-10),
      suspicious: this.attackPatterns.suspicious.slice(-10),
      mlDetected: this.attackPatterns.mlDetected.slice(-10)
    };
  }
  
  // Limpiar todo
  clear() {
    this.requests = [];
    this.requestDetails.clear();
    this.attackPatterns = {
      ddos: [],
      bruteForce: [],
      portScan: [],
      suspicious: [],
      mlDetected: []
    };
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      mlPredictions: 0,
      lastUpdate: Date.now()
    };
    chrome.action.setBadgeText({ text: '' });
  }
  
  // Habilitar/deshabilitar ML
  setMLEnabled(enabled) {
    this.mlEnabled = enabled;
    console.log(`🤖 Detección ML ${enabled ? 'habilitada' : 'deshabilitada'}`);
  }
  
  // Exportar tráfico para análisis offline
  exportTrafficData() {
    const data = Array.from(this.requestDetails.values());
    return {
      traffic: data,
      stats: this.stats,
      attacks: this.attackPatterns,
      exportedAt: new Date().toISOString()
    };
  }
}

// Exportar para uso en background
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NetworkMonitor;
}
