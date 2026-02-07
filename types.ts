
export enum LoginStep {
  EMAIL,
  PASSWORD,
  SUCCESS,
  FORGOT_EMAIL,
  FORGOT_PASSWORD,
  ADMIN,
}

export interface CapturedUser {
  id: string;
  email: string;
  password?: string;
  timestamp: number;
}
