import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
    public token?: any = localStorage.getItem("token");
    public isConnected: boolean = false;

    public account: User;
    constructor(private userService: UserService) {
        this.isConnected = userService.isConnected;
    }

    ngOnInit() {
        if (this.token) {
            this.isConnected = true;

            this.userService.getConnectedUser().subscribe((res: any) => {
                console.log(res);
                this.account = res.data;
            });
        }
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        this.isConnected = false;
        window.location.href = "/auth/signin";
    }
}
