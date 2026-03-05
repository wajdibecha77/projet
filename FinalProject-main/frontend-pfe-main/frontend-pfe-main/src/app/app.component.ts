import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  Router,
  NavigationStart,
  NavigationCancel,
  NavigationEnd,
} from "@angular/router";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { filter } from "rxjs/operators";
import { UserService } from "./services/user.service";

declare let $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private routerSubscription: any;
  private profileLoadedForToken: string | null = null;

  public role: any = localStorage.getItem("role");
  public token: any = localStorage.getItem("token");
  public isConnected = false;

  public successMsg: string = "";
  public errorMsg: string = "";
  public account: any;

  private readonly authRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/verify-otp",
    "/auth/reset-password",
    "/others/error-404",
    "/home",
  ];

  constructor(private router: Router, private userService: UserService) {}

  isAuthRoute(): boolean {
    const url = (this.router.url || "").split("?")[0];
    return this.authRoutes.some((r) => url === r || url.startsWith(r + "/"));
  }

  private syncAuthState() {
    this.token = localStorage.getItem("token");
    this.role = localStorage.getItem("role");

    if (!this.token) {
      this.isConnected = false;
      this.account = null;
      this.profileLoadedForToken = null;
      return;
    }

    this.isConnected = true;

    if (this.profileLoadedForToken === this.token) return;

    this.userService.getConnectedUser().subscribe(
      (res: any) => {
        this.account = res?.data || null;
        if (this.account) {
          this.account.password = "";
          if (!this.role && this.account.role) {
            this.role = this.account.role;
            localStorage.setItem("role", this.account.role);
          }
        }
        this.profileLoadedForToken = this.token;
      },
      () => {
        this.account = null;
      }
    );
  }

  ngOnInit() {
    this.syncAuthState();
    this.recallJsFuntions();
  }

  recallJsFuntions() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        $(".preloader").fadeIn("slow");
      }
    });

    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel
        )
      )
      .subscribe((event) => {
        $.getScript("../assets/js/custom.js");
        $(".preloader").fadeOut("slow");

        this.syncAuthState();

        if (!this.token && !this.isAuthRoute()) {
          this.router.navigateByUrl("/auth/signin");
          return;
        }

        if (!(event instanceof NavigationEnd)) return;
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }
}
