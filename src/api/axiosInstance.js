import axios from 'axios';
import { API_BASE_URL } from '../api-config';
import store from '../store/store';
import { refreshAccessToken, clearAuth } from '../store/actions/authActions';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

/* Request Interceptor */
api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* Response Interceptor */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;
    const isRetryRequest = originalRequest._retry;
    const requiresAuth = originalRequest.requiresAuth === true;

    // 로그인 필요 API가 아니면 refresh 시도 안 함
    if (!isUnauthorized || isRetryRequest || !requiresAuth) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const reissueResponse = await axios.post(
        `${API_BASE_URL}/auth/reissue`,
        {},
        { withCredentials: true }
      );

      const newAccessToken =
        reissueResponse.headers.authorization?.replace('Bearer ', '');

      if (!newAccessToken) {
        throw new Error('Invalid reissue response');
      }

      store.dispatch(refreshAccessToken(newAccessToken));

      isRefreshing = false;
      onRefreshed(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (e) {
      isRefreshing = false;
      refreshSubscribers = [];

      store.dispatch(clearAuth());
      window.location.href='/';

      return Promise.reject(e);
    }
  }
);

export default api;