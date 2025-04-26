export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}