import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { InterventionService } from "src/app/services/intervention.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    public interventions: any;
    public intervention;
    public totalInfo = 0;
    public totalMeca = 0;
    public totalElec = 0;
    public totalPlom = 0;
    public total = 0;
    public totalByMonth = 0;

    public dataElec: number[] = Array(12).fill(0);
    public dataMeca: number[] = Array(12).fill(0);
    public dataInfo: number[] = Array(12).fill(0);
    public dataPlom: number[] = Array(12).fill(0);
    public token?: any = localStorage.getItem("token");
    public isConnected: boolean = false;

    public account: User;
    constructor(
        private userService: UserService,
        private interService: InterventionService
    ) {
        this.isConnected = userService.isConnected;
    }

    private resetDashboardStats() {
        this.totalInfo = 0;
        this.totalMeca = 0;
        this.totalElec = 0;
        this.totalPlom = 0;
        this.total = 0;
        this.totalByMonth = 0;
        this.dataElec = Array(12).fill(0);
        this.dataMeca = Array(12).fill(0);
        this.dataInfo = Array(12).fill(0);
        this.dataPlom = Array(12).fill(0);
    }

    private getInterventionType(name: string): "INFO" | "MECA" | "ELEC" | "PLOM" | null {
        const value = String(name || "").toLowerCase();
        if (value.includes("info")) return "INFO";
        if (value.includes("meca")) return "MECA";
        if (value.includes("elec")) return "ELEC";
        if (
            value.includes("plom") ||
            value.includes("chaud") ||
            value.includes("froid")
        ) {
            return "PLOM";
        }
        return null;
    }

    ngOnInit(): void {
        if (this.token) {
            this.isConnected = true;

            this.userService.getConnectedUser().subscribe((res: any) => {
                console.log(res);
                this.account = res.data;
            });
        }

        this.interService.getAllInterventions().subscribe((res: any) => {
            this.resetDashboardStats();
            this.total = res.length;

            const currentMonth = new Date().getMonth();
            res.forEach((inter) => {
                const monthIntervention = new Date(inter.createdAt).getMonth();
                const type = this.getInterventionType(inter?.name);

                if (type === "INFO") {
                    this.totalInfo += 1;
                    this.dataInfo[monthIntervention] += 1;
                } else if (type === "MECA") {
                    this.totalMeca += 1;
                    this.dataMeca[monthIntervention] += 1;
                } else if (type === "ELEC") {
                    this.totalElec += 1;
                    this.dataElec[monthIntervention] += 1;
                } else if (type === "PLOM") {
                    this.totalPlom += 1;
                    this.dataPlom[monthIntervention] += 1;
                }

                if (monthIntervention === currentMonth) {
                    this.totalByMonth += 1;
                }
            });
        });
    }
}
