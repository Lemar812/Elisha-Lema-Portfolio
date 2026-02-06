// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  works: {
    list: () => `${API_URL}/api/works`,
    create: () => `${API_URL}/api/works`,
    update: (id: string) => `${API_URL}/api/works/${id}`,
    delete: (id: string) => `${API_URL}/api/works/${id}`,
  },
  skills: {
    list: () => `${API_URL}/api/skills`,
    create: () => `${API_URL}/api/skills`,
    update: (id: string) => `${API_URL}/api/skills/${id}`,
    delete: (id: string) => `${API_URL}/api/skills/${id}`,
  },
  profile: {
    get: () => `${API_URL}/api/profile`,
    update: () => `${API_URL}/api/profile`,
  },
  contact: () => `${API_URL}/api/contact`,
  login: () => `${API_URL}/api/login`,
  visit: () => `${API_URL}/api/visit`,
  stats: () => `${API_URL}/api/stats`,
};
