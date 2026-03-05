import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login-verify",
  templateUrl: "./login-verify.component.html",
  styleUrls: ["./login-verify.component.scss"],
})
export class LoginVerifyComponent implements OnInit {
  public email: string = "";
  public otp: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get("email") || "";
  }

  verify() {
    this.userService.verifyLoginOtp({
      email: this.email,
      otp: this.otp,
    }).subscribe({
      next: () => {
        this.router.navigate(["/auth/signin"]);
      },
      error: () => {
        this.notifier.show({
          type: "error",
          message: "Code invalide",
          id: "THAT_NOTIFICATION_ID",
        });
      },
    });
  }
}