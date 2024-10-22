const BASE_URL = "https://localhost:7100/api"; // URL-ul de bază al API-ului

/**
 * Funcția pentru a construi query params dintr-un obiect payload.
 *
 * @param payload - obiectul cu parametrii query, ex: {id: '123', name: 'example'}
 * @returns stringul cu query params, ex: '?id=123&name=example'
 */
const buildQueryParams = (payload?: Record<string, any>) => {
  if (!payload) return '';
  
  const searchParams = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Funcția pentru a trimite cereri API.
 *
 * @param endpoint - segmentul de URL, ex: 'Objectives/getById'
 * @param method - metoda HTTP, ex: 'GET', 'POST', 'PUT'
 * @param body - corpul cererii, opțional, doar pentru metodele POST și PUT
 * @param query - obiect cu parametrii query, ex: {id: '123', name: 'example'}
 * @returns răspunsul cererii ca obiect JSON
 */
const fetchApi = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  query?: Record<string, any>
) => {
  // Construiește URL-ul complet cu query params
  const queryString = buildQueryParams(query);
  const url = `${BASE_URL}/${endpoint}${queryString}`;

  // Pregătește opțiunile pentru fetch
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  // Adaugă corpul doar pentru metodele POST și PUT
  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    // Verifică dacă răspunsul a fost de succes
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parsează răspunsul
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
};

export default fetchApi;
