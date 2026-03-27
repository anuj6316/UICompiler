import { env } from '../config/env';

/**
 * Core API Service with Automatic Token Refresh
 */

interface FetchOptions extends RequestInit {
  // Add any custom options here
}

// Helper to get tokens
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

async function fetchWithConfig(endpoint: string, options: FetchOptions = {}) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${env.apiUrl}${path}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Automatically add Auth Token if available
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let config: RequestInit = {
    ...options,
    headers,
  };

  try {
    let response = await fetch(url, config);

    // --- AUTOMATIC TOKEN REFRESH LOGIC ---
    // If we get a 401 (Unauthorized) and we have a refresh token, try to get a new access token
    if (response.status === 401 && getRefreshToken() && !endpoint.includes('/auth/login')) {
      console.log('Access token expired, attempting refresh...');
      
      const refreshResponse = await fetch(`${env.apiUrl}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: getRefreshToken() }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        localStorage.setItem('access_token', refreshData.access);
        
        // Retry the original request with the new token
        headers.set('Authorization', `Bearer ${refreshData.access}`);
        response = await fetch(url, { ...config, headers });
      } else {
        // Refresh failed (refresh token expired/invalid) -> Log user out
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/'; // Or trigger a state change in App.tsx
      }
    }

    if (!response.ok) {
      let errorMessage = `Error: ${response.status}`;
      try {
        const errorData = await response.json();
        // Django REST Framework often returns errors in different structures
        if (errorData.msg) errorMessage = errorData.msg;
        else if (errorData.detail) errorMessage = errorData.detail;
        else if (errorData.data) errorMessage = JSON.stringify(errorData.data);
      } catch (e) { }
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return await response.json();
    
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined }),

  put: <T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),

  patch: <T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),

  delete: <T>(endpoint: string, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'DELETE' }),
};
