
const CACHE_NAME = 'agendaja-v2';
const STATIC_CACHE = 'agendaja-static-v2';
const DYNAMIC_CACHE = 'agendaja-dynamic-v2';

// Assets críticos para cache
const STATIC_ASSETS = [
  '/',
  '/login',
  '/manifest.json',
  '/favicon.ico'
];

// Assets dinâmicos para cache
const CACHE_STRATEGIES = {
  '/api/': 'networkFirst',
  '/static/': 'cacheFirst',
  '/images/': 'cacheFirst',
  default: 'staleWhileRevalidate'
};

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(STATIC_ASSETS)
      ),
      self.skipWaiting()
    ])
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then(cacheNames => 
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      ),
      self.clients.claim()
    ])
  );
});

// Fetch estratégico
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests não HTTP
  if (!request.url.startsWith('http')) return;

  // Determinar estratégia de cache
  let strategy = CACHE_STRATEGIES.default;
  
  for (const [pattern, cacheStrategy] of Object.entries(CACHE_STRATEGIES)) {
    if (url.pathname.startsWith(pattern)) {
      strategy = cacheStrategy;
      break;
    }
  }

  event.respondWith(handleRequest(request, strategy));
});

// Estratégias de cache
async function handleRequest(request, strategy) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  switch (strategy) {
    case 'cacheFirst':
      return cacheFirst(request, cache);
    case 'networkFirst':
      return networkFirst(request, cache);
    case 'staleWhileRevalidate':
    default:
      return staleWhileRevalidate(request, cache);
  }
}

async function cacheFirst(request, cache) {
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.log('SW: Cache first fallback for:', request.url);
    return new Response('Offline fallback', { status: 503 });
  }
}

async function networkFirst(request, cache) {
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    
    console.log('SW: Network first fallback for:', request.url);
    return new Response('Offline fallback', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cache) {
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Background Sync otimizado
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      console.log('SW: Background sync completed');
    }
  } catch (error) {
    console.error('SW: Background sync failed:', error);
  }
}

// Push notifications otimizadas
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'Nova notificação do AgendaJa',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      ...data,
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'Ver detalhes'
      },
      {
        action: 'dismiss',
        title: 'Dispensar'
      }
    ],
    requireInteraction: data.priority === 'high'
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'AgendaJa', 
      options
    )
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    const urlToOpen = event.notification.data?.url || '/unidade/dashboard';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Verificar se já existe uma janela aberta
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        
        // Abrir nova janela se necessário
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
