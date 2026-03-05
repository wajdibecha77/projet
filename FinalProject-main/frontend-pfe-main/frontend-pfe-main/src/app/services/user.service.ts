import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public base_Url = "http://localhost:5000";
  public isConnected: boolean = false;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      "x-auth-token": token ? token : "",
    });
  }

  public login(email: any, password: any) {
    return this.http.post(this.base_Url + "/users/login", {
      email: email,
      password: password,
    });
  }

  public loginSecure(payload: { email: string; password: string }) {
    return this.http.post(this.base_Url + "/auth/login-secure", payload);
  }

  public verifyLoginOtp(payload: { email: string; otp: string }) {
    return this.http.post(this.base_Url + "/auth/challenge/verify", payload);
  }

  public forgotPassword(email: string) {
    return this.http.post(this.base_Url + "/users/forgot-password/request", {
      email,
    });
  }

  public verifyForgotPasswordOtp(email: string, otp: string) {
    return this.http.post(this.base_Url + "/users/forgot-password/verify", {
      email,
      otp,
    });
  }

  public resendForgotPasswordOtp(email: string) {
    return this.http.post(this.base_Url + "/users/forgot-password/resend", {
      email,
    });
  }

  public resetPasswordWithOtp(
    email: string,
    resetToken: string,
    newPassword: string,
    confirmPassword: string
  ) {
    return this.http.post(this.base_Url + "/users/forgot-password/reset", {
      email,
      resetToken,
      newPassword,
      confirmPassword,
    });
  }

  public getConnectedUser() {
    const token = localStorage.getItem("token");
    if (token) this.isConnected = true;
    return this.http.get(this.base_Url + "/users/me", {
      headers: this.authHeaders(),
    });
  }

  public updateUser(id: any, account: any) {
    return this.http.put(this.base_Url + "/users/update/" + id, account, {
      headers: this.authHeaders(),
    });
  }

  public getUserById(id: any) {
    return this.http.get(this.base_Url + "/users/get/" + id, {
      headers: this.authHeaders(),
    });
  }

  public createUser(account: any) {
    return this.http.post(this.base_Url + "/users/createuser", account, {
      headers: this.authHeaders(),
    });
  }

  public createFournisseur(account: any) {
    return this.http.post(this.base_Url + "/users/createFournisseur", account, {
      headers: this.authHeaders(),
    });
  }

  public getAllUsers() {
    return this.http.get(this.base_Url + "/users", {
      headers: this.authHeaders(),
    });
  }

  public getAllFournisseurs() {
    return this.http.get(this.base_Url + "/users/getAllFournisseurs", {
      headers: this.authHeaders(),
    });
  }

  public getFournisseurById(id: any) {
    return this.http.get(this.base_Url + `/users/getFournisseur/${id}`, {
      headers: this.authHeaders(),
    });
  }

  public updateFournisseur(id: any, fournisseur: any) {
    return this.http.put(this.base_Url + `/users/updateFournisseur/${id}`, fournisseur, {
      headers: this.authHeaders(),
    });
  }

  public deleteFournisseur(id: any) {
    return this.http.delete(this.base_Url + `/users/deleteFournisseur/${id}`, {
      headers: this.authHeaders(),
    });
  }

  public deleteUser(id: any) {
    return this.http.delete(this.base_Url + `/users/delete/${id}`, {
      headers: this.authHeaders(),
    });
  }
}