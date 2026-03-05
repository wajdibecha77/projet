import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class InterventionService {
    public base_Url = "http://localhost:5000";
    public isConnected: boolean = false;
    constructor(private http: HttpClient) {}

    public createIntervention(intervention) {
        let token = localStorage.getItem("token");
        let headers = new HttpHeaders({
            "x-auth-token": token ? token : "",
        });
        if (token) {
            this.isConnected = true;
        }
        return this.http.post(
            this.base_Url + "/interventions/add-intervention",
            intervention,
            { headers }
        );
    }

    public getAllInterventions() {
        let token = localStorage.getItem("token");
        let headers = new HttpHeaders({
            "x-auth-token": token ? token : "",
        });
        if (token) {
            this.isConnected = true;
        }
        return this.http.get(this.base_Url + "/interventions/all", { headers });
    }

    public getInterventionById(id) {
        let token = localStorage.getItem("token");
        let headers = new HttpHeaders({
            "x-auth-token": token ? token : "",
        });

        return this.http.get(this.base_Url + "/interventions/id/" + id, {
            headers,
        });
    }

    public updateInterventionStatus(id, data) {
        let token = localStorage.getItem("token");
        let headers = new HttpHeaders({
            "x-auth-token": token ? token : "",
        });
        return this.http.put(
            this.base_Url + `/interventions/update/${id}`,
            data,
            { headers }
        );
    }

    public deleteIntervention(id) {
        let token = localStorage.getItem("token");
        let headers = new HttpHeaders({
            "x-auth-token": token ? token : "",
        });
        return this.http.delete(
            this.base_Url + `/interventions/delete/${id}`,

            { headers }
        );
    }

    public updateInterventionOrder(id, data) {
        let token = localStorage.getItem("token");
        let headers = new HttpHeaders({
            "x-auth-token": token ? token : "",
        });
        return this.http.put(
            this.base_Url + `/orders/intervention/${id}`,
            data,
            { headers }
        );
    }
}
