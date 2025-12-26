import { api } from "./axios";

export const setupInterceptors = () => {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      
      // Skip if request was already retried or if it's a refresh request itself
      if (originalRequest._retry || originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // Handle 401 errors (unauthorized) - try to refresh token
      if (error.response?.status === 401) {
        const message = error.response?.data?.message || "";
        const code = error.response?.data?.error?.code;

        // Skip refresh for login/signup endpoints to avoid infinite loops
        if (originalRequest.url?.includes("/auth/login") || 
            originalRequest.url?.includes("/auth/signup")) {
          return Promise.reject(error);
        }

        // Check if error is related to token expiration or missing token
        // Backend sends: "Unauthorized: Token expired" or "Unauthorized: No token found" or "Unauthorized: Invalid token"
        const isTokenError = 
          message.includes("Token expired") || 
          message.includes("No token found") ||
          message.includes("Invalid token") ||
          message.includes("Unauthorized") ||
          code === "ACCESS_TOKEN_EXPIRED";

        if (isTokenError) {
          originalRequest._retry = true;
          try {
            // Attempt to refresh the token
            // Backend expects refreshToken in cookies and will set new accessToken and refreshToken
            await api.post("/auth/refresh");
            // Retry the original request with new token
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear auth state and redirect to login
            // Clear any local auth state if needed
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        }
      }
      
      return Promise.reject(error);
    }
  );
};
