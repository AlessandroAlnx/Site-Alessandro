const host = window.location.hostname || 'localhost';
const backendPort = import.meta.env.VITE_API_PORT || '30081';

// Fallback works in Kubernetes with NodePort and in local browser tests.
export const API_URL = import.meta.env.VITE_API_URL || `http://${host}:${backendPort}/api`;
