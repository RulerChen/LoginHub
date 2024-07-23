import config from '@/config.js';
import { AxiosService } from '@/utils/axios.js';

export const axiosAuthInstance = new AxiosService(`${config.AUTH_BASE_URL}/api/${config.API_VERSION}/auth`, 'auth').axios;

export const signupService = async (body) => {
  const response = await axiosAuthInstance.post('/signup', body);
  return response;
};

export const signinService = async (body) => {
  const response = await axiosAuthInstance.post('/signin', body);
  return response;
};

export const verifyEmailService = async (body) => {
  const response = await axiosAuthInstance.put('/verify-email', body);
  return response;
};
