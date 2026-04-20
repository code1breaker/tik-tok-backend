export interface SignupIf {
  username: string;
  email: string | null;
  phone: number | null;
  password: string;
  fullname: string;
}

export interface LoginIf {
  username: string;
  email: string | null;
  phone: number | null;
  password: string;
}
