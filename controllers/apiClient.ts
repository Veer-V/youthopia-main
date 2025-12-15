
export const API_BASE_URL = 'https://mpoweryouthopia.com/api';

export const apiClient = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },
    post: async (endpoint: string, body: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const text = await response.text();
            try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || errorData.error || `API Error: ${response.statusText}`);
            } catch (e) {
                throw new Error(`API Error: ${response.statusText} - ${text}`);
            }
        }
        return response.json();
    },
    put: async (endpoint: string, body: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const text = await response.text();
            try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || errorData.error || `API Error: ${response.statusText}`);
            } catch (e) {
                throw new Error(`API Error: ${response.statusText} - ${text}`);
            }
        }
        return response.json();
    },
    patch: async (endpoint: string, body: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const text = await response.text();
            try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || errorData.error || `API Error: ${response.statusText}`);
            } catch (e) {
                throw new Error(`API Error: ${response.statusText} - ${text}`);
            }
        }
        return response.json();
    },
    delete: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const text = await response.text();
            try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || errorData.error || `API Error: ${response.statusText}`);
            } catch (e) {
                throw new Error(`API Error: ${response.statusText} - ${text}`);
            }
        }
        // Some delete endpoints might return 204 No Content
        if (response.status === 204) return null;
        return response.json();
    },
};
