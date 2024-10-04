export class CreateUrlResponse {
  target: string;
  link: string;
  valid: boolean;
  password: string;
  redirections?: number;
  expiresAt?: number;
}
