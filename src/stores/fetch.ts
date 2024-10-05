const BASE_URL = "https://localhost:7100/api"; // URL-ul de bază al API-ului

/**
 * Funcția pentru a trimite cereri API.
 *
 * @param endpoint - segmentul de URL, ex: 'Objectives/getById'
 * @param method - metoda HTTP, ex: 'GET', 'POST', 'PUT'
 * @param body - corpul cererii, opțional, doar pentru metodele POST și PUT
 * @returns răspunsul cererii ca obiect JSON
 */
const fetchApi = async (
  endpoint: string,
  method: string = "GET",
  body?: any
) => {
  // Construiește URL-ul complet
  const url = `${BASE_URL}/${endpoint}`;

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
