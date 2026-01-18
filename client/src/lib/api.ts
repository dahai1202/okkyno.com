
export async function apiRequest(method: string, url: string, data?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session management
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return response;
}

export async function apiGet<T>(url: string): Promise<T> {
  const response = await apiRequest('GET', url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function apiPost<T>(url: string, data?: any): Promise<T> {
  const response = await apiRequest('POST', url, data);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function apiPut<T>(url: string, data?: any): Promise<T> {
  const response = await apiRequest('PUT', url, data);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function apiDelete(url: string): Promise<void> {
  const response = await apiRequest('DELETE', url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
