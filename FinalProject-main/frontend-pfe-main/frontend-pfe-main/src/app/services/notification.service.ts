import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    public base_Url = "http://localhost:5000";

    constructor(private http: HttpClient) {}

    private authHeaders() {
        const token = localStorage.getItem("token");
        return new HttpHeaders({
            "x-auth-token": token ? token : "",
        });
    }

    public getAllNotifications() {
        return this.http.get(this.base_Url + "/notifications/all", {
            headers: this.authHeaders(),
        });
    }

    public markAsRead(id: string) {
        return this.http.put(
            this.base_Url + "/notifications/" + id + "/read",
            {},
            {
                headers: this.authHeaders(),
            }
        );
    }
}
