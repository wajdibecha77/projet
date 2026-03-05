import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
    public token?: any = localStorage.getItem("token");
    public isConnected: boolean = false;
    public successMsg: String = "";
    public errorMsg: String = "";
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
                this.account.password = "";
            });
        }
    }

    update() {
        console.log(this.account);
    }
}
