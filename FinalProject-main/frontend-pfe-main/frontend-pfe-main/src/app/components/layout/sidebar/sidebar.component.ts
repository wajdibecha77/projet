import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subject, interval } from "rxjs";
import { filter, startWith, switchMap, takeUntil } from "rxjs/operators";
import { NotificationService } from "src/app/services/notification.service";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, OnDestroy {
    public role = localStorage.getItem("role");
    public notificationsCount = 0;
    private destroy$ = new Subject<void>();
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
    constructor(
        private notificationService: NotificationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.notificationService.notificationsCount$
            .pipe(takeUntil(this.destroy$))
            .subscribe((count) => {
                this.notificationsCount = count;
            });

        interval(30000)
            .pipe(
                startWith(0),
                switchMap(() => this.notificationService.refreshNotificationsCount()),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (count) => {
                    this.notificationsCount = count;
                },
                error: () => {
                    this.notificationsCount = 0;
                },
            });

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe((event: NavigationEnd) => {
                if (event.urlAfterRedirects === "/notifications") {
                    this.notificationsCount = 0;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/auth/signin";
    }
}
