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
    public isSubmitting: boolean = false;
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
        this.successMsg = "";
        this.errorMsg = "";

        const userId = (this.account as any)?._id;
        if (!userId) {
            this.errorMsg = "Utilisateur introuvable.";
            return;
        }

        this.isSubmitting = true;
        this.userService.updateUser(userId, this.account).subscribe(
            (res: any) => {
                this.account = res?.data || this.account;
                this.account.password = "";
                this.successMsg = "Profil mis a jour avec succes.";
                this.isSubmitting = false;
            },
            (err: any) => {
                this.errorMsg =
                    err?.error?.message || "Echec de mise a jour du profil.";
                this.isSubmitting = false;
            }
        );
    }
}
