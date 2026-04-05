export interface SignupIf {
  username: string;
  firstname: string;
  lastname: string;
  hashPassword: string;
}

export interface PhonneSignupIf extends SignupIf {
  phone: number;
}

export interface EmailignupIf extends SignupIf {
  email: string;
}
