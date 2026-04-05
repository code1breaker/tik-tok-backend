export interface SignupIf {
  username: string;
  email: string | null;
  phone: number | null;
  password: string;
  firstname: string;
  lastname: string;
}

export interface LoginIf {
  username: string;
  email: string | null;
  phone: number | null;
  password: string;
}
