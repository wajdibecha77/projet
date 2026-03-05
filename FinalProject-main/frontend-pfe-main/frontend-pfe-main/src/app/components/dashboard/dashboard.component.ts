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

    public dataElec = [];
    public dataMeca = [];
    public dataInfo = [];
    public dataPlom = [];
    public token?: any = localStorage.getItem("token");
    public isConnected: boolean = false;

    public account: User;
    constructor(
        private userService: UserService,
        private interService: InterventionService
    ) {
        this.isConnected = userService.isConnected;
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
            console.log(res);
            this.total = res.length;

            res.map((inter) => {
                let monthIntervention =
                    new Date(inter.createdAt).getMonth() + 1;
                let currentMonth = new Date().getMonth() + 1;
                if (inter.name.toLowerCase().includes("info")) {
                    this.totalInfo += 1;
                    for (let i = 0; i < 12; i++) {
                        if (monthIntervention == i + 1) {
                            if (this.dataInfo[i]) {
                                this.dataInfo[i] += 1;
                            } else {
                                this.dataInfo[i] = 1;
                            }
                        } else {
                            this.dataInfo[i] = 0;
                        }
                    }
                }
                if (inter.name.toLowerCase().includes("meca")) {
                    this.totalMeca += 1;
                    for (let i = 0; i < 12; i++) {
                        if (monthIntervention == i + 1) {
                            if (this.dataMeca[i]) {
                                this.dataMeca[i] += 1;
                            } else {
                                this.dataMeca[i] = 1;
                            }
                        } else {
                            this.dataMeca[i] = 0;
                        }
                    }
                }
                if (inter.name.toLowerCase().includes("elec")) {
                    this.totalElec += 1;
                    for (let i = 0; i < 12; i++) {
                        if (monthIntervention == i + 1) {
                            if (this.dataElec[i]) {
                                this.dataElec[i] += 1;
                            } else {
                                this.dataElec[i] = 1;
                            }
                        } else {
                            this.dataElec[i] = 0;
                        }
                    }
                }
                if (inter.name.toLowerCase().includes("plom")) {
                    this.totalPlom += 1;
                    for (let i = 0; i < 12; i++) {
                        if (monthIntervention == i + 1) {
                            if (this.dataPlom[i]) {
                                this.dataPlom[i] += 1;
                            } else {
                                this.dataPlom[i] = 1;
                            }
                        } else {
                            this.dataPlom[i] = 0;
                        }
                    }
                }

                if (monthIntervention == currentMonth) {
                    this.totalByMonth += 1;
                }
            });

            console.log(this.dataElec);
        });
    }
}
