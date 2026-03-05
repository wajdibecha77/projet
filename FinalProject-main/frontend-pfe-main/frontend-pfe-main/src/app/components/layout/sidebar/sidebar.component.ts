import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
    public role = localStorage.getItem("role");
    public sidebarItems = [
        {
            path: this.role == "ADMIN" ? "/dashboard" : "/dashboard-client",
            title: "Dashboard",
            icon: "grid",
        },
        this.role == "ADMIN" && {
            path: "/users",
            title: "Users",
            icon: "users",
        },
        {
            path: this.role == "ADMIN" ? "/interventions" : "/mes-interventions",
            title: "Interventions",
            icon: "info",
        },
        this.role == "ADMIN" && {
            path: "/services",
            title: "Services",
            icon: "inbox",
        },

        this.role == "ADMIN" && {
            path: "/fournisseurs",
            title: "Fournisseurs",
            icon: "user",
        },
        {
            path: "/commandes",
            title: "commandes",
            icon: "list",
            class: "",
        },
        this.role == "ADMIN" && {
            path: "/create-user",
            title: "Create user",
            icon: "user",
        },
        {
            path: "/user-profile",
            title: "User Profile",
            icon: "settings",
        },

        {
            path: "/notifications",
            title: "Notifications",
            icon: "bell",
            class: "",
        },
    ];
    constructor() {}

    ngOnInit(): void {}

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/auth/signin";
    }
}
