import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://vendify_api.wxbolab.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const apiClient = {
  get: <T>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.get<T>(url, config);
  },
  post: <T, D>(
    url: string,
    data: D,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, data, config);
  },
  put: <T, D>(
    url: string,
    data: D,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.put<T>(url, data, config);
  },
  delete: <T>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.delete<T>(url, config);
  },
};

export default apiClient;
