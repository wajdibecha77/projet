import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {}

  loginSecure(
    email: string,
    password: string,
    coords?: { lat: number; lng: number; accuracy?: number }
  ): Observable<any> {
    return this.http.post(`${this.API}/login-secure`, { email, password, coords });
  }

  verifyLoginOtp(challengeId: string, otp: string): Observable<any> {
    return this.http.post(`${this.API}/challenge/verify`, { challengeId, otp });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API}/forgot-password`, { email });
  }

  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.API}/verify-reset-code`, { email, code });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API}/reset-password`, { email, code, newPassword });
  }
}