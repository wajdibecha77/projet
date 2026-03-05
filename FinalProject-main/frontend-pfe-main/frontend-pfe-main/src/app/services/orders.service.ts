import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  public base_Url = "http://localhost:5000";
  public isConnected: boolean = false;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      "x-auth-token": token ? token : "",
    });
  }

  
  public createOrder(payload: any) {
    return this.http.post(this.base_Url + "/orders", payload, {
      headers: this.authHeaders(),
    });
  }

  
  public getAllOrders() {
    return this.http.get(this.base_Url + "/orders/all", {
      headers: this.authHeaders(),
    });
  }

  
  public getOrderById(id: string) {
    return this.http.get(this.base_Url + "/orders/one/" + id, {
      headers: this.authHeaders(),
    });
  }

 
  public updateOrder(id: string, payload: any) {
    return this.http.put(this.base_Url + "/orders/one/" + id, payload, {
      headers: this.authHeaders(),
    });
  }

 
  public updateOrderStatus(payload: any, id: string) {
    return this.http.put(this.base_Url + "/orders/" + id, payload, {
      headers: this.authHeaders(),
    });
  }

 
  public deleteOrder(id: string) {
    return this.http.delete(this.base_Url + "/orders/" + id, {
      headers: this.authHeaders(),
    });
  }
}