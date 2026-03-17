import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:5000/auth';
  private readonly deviceIdStorageKey = 'trusted_device_id';

  constructor(private http: HttpClient) {}

  private normalizeEmail(email: string): string {
    return String(email || '').trim().toLowerCase();
  }

  private getCurrentUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  }

  private getOrCreateDeviceId(): string {
    const existingDeviceId = localStorage.getItem(this.deviceIdStorageKey);
    if (existingDeviceId) return existingDeviceId;

    const browserCrypto =
      typeof window !== 'undefined' ? (window as any).crypto : null;
    const generatedDeviceId =
      browserCrypto && typeof browserCrypto.randomUUID === 'function'
        ? browserCrypto.randomUUID()
        : `device_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(this.deviceIdStorageKey, generatedDeviceId);
    return generatedDeviceId;
  }

  private getTrustedDeviceFlagKey(email: string): string {
    return `trusted_device_flag:${this.normalizeEmail(email)}:${this.getOrCreateDeviceId()}`;
  }

  public isTrustedDeviceLocally(email: string): boolean {
    return localStorage.getItem(this.getTrustedDeviceFlagKey(email)) === 'true';
  }

  public markTrustedDevice(email: string): void {
    localStorage.setItem(this.getTrustedDeviceFlagKey(email), 'true');
    localStorage.setItem('trusted_device_user_agent', this.getCurrentUserAgent());
  }

  public clearTrustedDevice(email: string): void {
    localStorage.removeItem(this.getTrustedDeviceFlagKey(email));
  }

  loginSecure(
    email: string,
    password: string,
    coords?: { lat: number; lng: number; accuracy?: number }
  ): Observable<any> {
    return this.http.post(`${this.API}/login-secure`, {
      email,
      password,
      coords,
      deviceInfo: {
        deviceId: this.getOrCreateDeviceId(),
        userAgent: this.getCurrentUserAgent(),
        trustedDevice: this.isTrustedDeviceLocally(email),
      },
    });
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
