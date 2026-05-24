import { getToken, logout } from './auth';

const BASE_URL = 'http://localhost:8000';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      logout();
    }
    throw new Error('Unauthorized');
  }

  return res;
}

// Keep existing auth endpoints unauthenticated
export async function login(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Login failed');
  }

  return res.json();
}

export async function signup(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Signup failed');
  }

  return res.json();
}

// ----------------------------------------------------
// NEW SaaS URL Shortener Endpoints
// ----------------------------------------------------

export async function shortenUrl(url: string, alias?: string, expiry?: string) {
  const payload: { url: string; alias?: string; expiry?: string } = { url };
  if (alias) payload.alias = alias;
  if (expiry) {
    try {
      payload.expiry = new Date(expiry).toISOString();
    } catch(e) {
      payload.expiry = expiry;
    }
  }

  const res = await fetchWithAuth('/api/v1/shorten', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to shorten URL');
  }

  return res.json();
}

export async function generateQr(url: string, alias?: string, expiry?: string) {
  const payload: { url: string; alias?: string; expiry?: string } = { url };
  if (alias) payload.alias = alias;
  if (expiry) {
    try {
      payload.expiry = new Date(expiry).toISOString();
    } catch(e) {
      payload.expiry = expiry;
    }
  }

  const res = await fetchWithAuth('/api/v1/qr', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to generate QR');
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function getUserUrls() {
  const res = await fetchWithAuth('/api/v1/user/urls', {
    method: 'GET',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch URLs');
  }

  return res.json();
}

export async function deleteUrl(code: string) {
  const res = await fetchWithAuth(`/api/v1/${code}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete URL');
  }

  return res.json().catch(() => ({}));
}

export async function checkAlias(code: string) {
  const res = await fetchWithAuth(`/api/v1/alias/check/${code}`, {
    method: 'GET',
  });
  
  if (!res.ok) {
    throw new Error('Failed to check alias');
  }

  return res.json();
}

export async function getAnalytics(code: string) {
  const res = await fetchWithAuth(`/api/v1/analytics/${code}`, {
    method: 'GET',
  });

  const data = await res.json().catch(() => null);
  
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to get analytics');
  }

  return data;
}

export async function getQrviaCode(code: string) {
  const res = await fetchWithAuth(`/api/v1/qr/${code}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to get QR code');
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// Direct URL fetcher used by redirect page (no auth needed)
export async function getOriginalUrl(code: string) {
  window.location.replace(`${BASE_URL}/${code}`);
}
