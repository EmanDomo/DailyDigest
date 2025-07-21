const useProduction = true;

export const API_BASE_URL = useProduction
  ? "https://dailydigest.onrender.com"
  : "http://localhost:8000";