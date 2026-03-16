import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from "@angular/router";

@Injectable({ providedIn: "root" })
export class RoleGuard implements CanActivate {
  private readonly technicianRoles = [
    "INFORMATICIEN",
    "ELECTRICIEN",
    "MECANICIEN",
    "PLOMBERIE",
    "TECHNICIEN",
  ];

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    let role = String(localStorage.getItem("role") || "").toUpperCase();
    if (!role) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        role = String(user?.role || "").toUpperCase();
      } catch {
        role = "";
      }
    }

    const allowAdminsOnly = route.data?.adminsOnly === true;
    const allowTechniciansOnly = route.data?.techniciansOnly === true;
    const allowNonAdminOnly = route.data?.nonAdminOnly === true;

    if (allowAdminsOnly && role !== "ADMIN") {
      return this.router.parseUrl("/dashboard-client");
    }

    if (allowNonAdminOnly && role === "ADMIN") {
      return this.router.parseUrl("/dashboard");
    }

    if (allowTechniciansOnly && !this.technicianRoles.includes(role)) {
      return this.router.parseUrl("/dashboard-client");
    }

    return true;
  }
}
