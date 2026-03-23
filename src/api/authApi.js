import api from './axiosInstance';

export const signInApi = (email, password) => {
    return api.post('/auth/signIn',{
        email,
        password
    });
};

export const signOutApi = () => {
    return api.post('/auth/signOut', { requiresAuth: true });
};

export const reissueApi = () => {
    return api.post('/auth/reissue');
}

export const exchangeOAuthCodeApi = (code) => {
    return api.post('/auth/oauth/exchange', {
        code,
    });
};