/**
 * Network Monitor - Análisis de tráfico en tiempo real
 * Detecta ataques DDoS, Fuerza Bruta y patrones anómalos
 */

class NetworkMonitor {
  constructor() {
    this.requests = [];
    this.attackPatterns = {
      ddos: [],
      bruteForce: [],
      portScan: [],
      suspicious: []
    };
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      lastUpdate: Date.now()
    };
    
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
    const request = {
      id: details.requestId,
      url: details.url,
      method: details.method,
      type: details.type,
      timestamp: details.timeStamp,
      tabId: details.tabId,
      initiator: details.initiator
    };
    
    this.requests.push(request);
    this.stats.totalRequests++;
    
    // Mantener solo últimos 1000 requests
    if (this.requests.length > 1000) {
      this.requests.shift();
    }
    
    // Detección inmediata
    this.detectDDoS(request);
    this.detectSuspiciousPatterns(request);
    
    // Actualizar badge
    this.updateBadge();
  }
  
  onResponse(details) {
    // Detectar intentos de fuerza bruta (401, 403)
    if (details.statusCode === 401 || details.statusCode === 403) {
      this.detectBruteForce(details);
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
  
  // Obtener estadísticas
  getStats() {
    return {
      ...this.stats,
      attacks: {
        ddos: this.attackPatterns.ddos.length,
        bruteForce: this.attackPatterns.bruteForce.length,
        suspicious: this.attackPatterns.suspicious.length
      },
      recentRequests: this.requests.slice(-50) // Últimas 50
    };
  }
  
  // Obtener ataques detectados
  getAttacks() {
    return {
      ddos: this.attackPatterns.ddos.slice(-10),
      bruteForce: this.attackPatterns.bruteForce.slice(-10),
      suspicious: this.attackPatterns.suspicious.slice(-10)
    };
  }
  
  // Limpiar todo
  clear() {
    this.requests = [];
    this.attackPatterns = {
      ddos: [],
      bruteForce: [],
      portScan: [],
      suspicious: []
    };
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      lastUpdate: Date.now()
    };
    chrome.action.setBadgeText({ text: '' });
  }
}

// Exportar para uso en background
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NetworkMonitor;
}
