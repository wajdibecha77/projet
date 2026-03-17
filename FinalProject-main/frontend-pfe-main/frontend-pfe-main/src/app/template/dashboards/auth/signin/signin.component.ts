import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent implements OnInit {
  email = "";
  password = "";

  waitingVerification = false;
  challengeId = "";
  otp = "";

  messageFR = "";
  errorFR = "";
  loading = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const waiting = params.get("waiting");
      const cid = params.get("challengeId");

      if (waiting === "1" && cid) {
        this.waitingVerification = true;
        this.challengeId = cid;
        this.messageFR =
          "En attente de vérification… Un e-mail de confirmation a été envoyé. Cliquez sur “C’est moi”, puis saisissez le code reçu.";
      }
    });
  }

  private goToHome(user: any) {
    if (user?.role === "ADMIN") this.router.navigate(["/dashboard"]);
    else this.router.navigate(["/dashboard-client"]);
  }

  private doLogin(coords?: { lat: number; lng: number; accuracy?: number }) {
    this.authService.loginSecure(this.email, this.password, coords).subscribe({
      next: (res) => {
        this.loading = false;

        if (res?.challengeRequired) {
          this.authService.clearTrustedDevice(this.email);
          this.waitingVerification = true;
          this.challengeId = res.challengeId;
          this.messageFR =
            res.message ||
            "Vérification de connexion requise. Un e-mail vous a été envoyé.";
          return;
        }

        if (res?.token) {
          this.authService.markTrustedDevice(this.email);
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("role", res?.user?.role || "");
          this.goToHome(res.user);
          return;
        }

        this.errorFR = "Réponse inattendue du serveur.";
      },
      error: (err) => {
        this.loading = false;
        this.errorFR = err?.error?.message || "Erreur lors de la connexion.";
      },
    });
  }

  onLogin(): void {
    this.loading = true;
    this.errorFR = "";
    this.messageFR = "";

    if (!navigator.geolocation) {
      this.doLogin();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.doLogin({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      () => {
        this.doLogin();
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }

  onVerifyOtp(): void {
    if (!this.challengeId) {
      this.errorFR = "ChallengeId manquant.";
      return;
    }

    this.loading = true;
    this.errorFR = "";

    this.authService.verifyLoginOtp(this.challengeId, this.otp).subscribe({
      next: (res) => {
        this.loading = false;

        if (res?.token) {
          this.authService.markTrustedDevice(this.email);
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("role", res?.user?.role || "");
          this.goToHome(res.user);
        } else {
          this.errorFR = "Code incorrect ou expiré.";
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorFR = err?.error?.message || "Erreur de vérification.";
      },
    });
  }

  cancelVerification(): void {
    this.waitingVerification = false;
    this.otp = "";
    this.challengeId = "";
    this.messageFR = "";
    this.errorFR = "";
  }
}
