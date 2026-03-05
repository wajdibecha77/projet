import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";

@Component({
    selector: "app-notifications",
    templateUrl: "./notifications.component.html",
    styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements OnInit {
    public notifications: any[] = [];

    constructor(
        private notificationService: NotificationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadNotifications();
    }

    loadNotifications() {
        this.notificationService.getAllNotifications().subscribe(
            (res: any) => {
                this.notifications = (res?.data || []).filter(
                    (notification: any) =>
                        notification?.category === "INTERVENTION_DECLARED"
                );
            },
            () => {
                this.notifications = [];
            }
        );
    }

    openNotification(notification: any) {
        if (!notification) {
            return;
        }

        this.notificationService.markAsRead(notification._id).subscribe(
            () => {
                this.loadNotifications();
            },
            () => {}
        );

        if (notification.interventionId) {
            this.router.navigate(["/intervention", notification.interventionId]);
            return;
        }

        this.router.navigate(["/notifications"]);
    }
}
