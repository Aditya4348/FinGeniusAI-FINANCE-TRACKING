// Tipe data Autentikasi yang selaras dengan Backend FastAPI

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  username: string;
  phone: string | null;
  job: string | null;
  avatar_url: string | null;
  payday: number;
  currency: string;
  balance_format: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  name: string;
  username: string;
  phone?: string | null;
  job?: string | null;
  payday?: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface UserUpdateProfile {
  name?: string;
  username?: string;
  phone?: string | null;
  job?: string | null;
  payday?: number;
  currency?: string;
  balance_format?: boolean;
  avatar_url?: string | null;
}

export interface UserChangePassword {
  current_password: string;
  new_password: string;
}
