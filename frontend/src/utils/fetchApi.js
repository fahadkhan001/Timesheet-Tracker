const BASE_URL = "http://localhost:3000"; 

export async function fetchApi(
  endpoint,
  data = {},
  method = "GET",
  token = null
) {
  const url = `${BASE_URL}/${endpoint}`;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}
