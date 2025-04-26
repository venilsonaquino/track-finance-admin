import HttpClient from '@/api/httpClient';
import { LoginRequest, RegisterRequest } from '@/api/dtos/auth/register/registerRequest';

export const AuthService = {
  register: (data: RegisterRequest) => HttpClient.post('/auth/register', data),
  login: (data: LoginRequest) => HttpClient.post('/auth/login', data),
};