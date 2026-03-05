import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { InterventionService } from "src/app/services/intervention.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-dashboard-client",
    templateUrl: "./dashboard-client.component.html",
    styleUrls: ["./dashboard-client.component.scss"],
})
export class DashboardClientComponent implements OnInit {
    public interventions: any = [];
    public intervention;
    public total;
    public dataElec: any = {
        total: 0,
        totalbyInter: 0,
        totalbyMe: 0,
        totalMe: 0,
        totalEnCours: 0,
        totalNotAffected: 0,
    };
    public dataMeca: any = {
        total: 0,
        totalMe: 0,
        totalbyMe: 0,
        totalbyInter: 0,
        totalEnCours: 0,
        totalNotAffected: 0,
    };
    public dataInfo: any = {
        total: 0,
        totalMe: 0,
        totalbyMe: 0,
        totalEnCours: 0,
        totalbyInter: 0,
        totalNotAffected: 0,
    };
    public dataPlom: any = {
        total: 0,
        totalMe: 0,
        totalbyMe: 0,
        totalbyInter: 0,
        totalEnCours: 0,
        totalNotAffected: 0,
    };
    public token?: any = localStorage.getItem("token");
    public isConnected: boolean = false;

    public account: any;
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

                this.interService
                    .getAllInterventions()
                    .subscribe((res: any) => {
                        this.total = res.length;
                        this.interventions = res;
                        res.map((inter) => {
                            let monthIntervention =
                                new Date(inter.createdAt).getMonth() + 1;
                            let currentMonth = new Date().getMonth() + 1;
                            if (inter.name.toLowerCase().includes("info")) {
                                this.dataInfo.total += 1;
                                this.dataInfo.totalbyInter = (
                                    (this.dataInfo.total * 100) /
                                    this.total
                                ).toFixed(2);
                                if (
                                    inter.affectedBy &&
                                    inter.etat == "EN_COURS"
                                ) {
                                    this.dataInfo.totalEnCours += 1;
                                    if (
                                        inter.affectedBy._id == this.account._id
                                    ) {
                                        this.dataInfo.totalMe += 1;

                                        this.dataInfo.totalbyMe = (
                                            (this.dataInfo.totalMe * 100) /
                                            this.dataInfo.total
                                        ).toFixed(2);
                                    }
                                } else {
                                    this.dataInfo.totalNotAffected += 1;
                                }
                            }
                            if (inter.name.toLowerCase().includes("meca")) {
                                this.dataMeca.total += 1;
                                this.dataMeca.totalbyInter = (
                                    (this.dataMeca.total * 100) /
                                    this.total
                                ).toFixed(2);
                                if (
                                    inter.affectedBy &&
                                    inter.etat == "EN_COURS"
                                ) {
                                    this.dataMeca.totalEnCours += 1;
                                    if (
                                        inter.affectedBy._id == this.account._id
                                    ) {
                                        this.dataMeca.totalMe += 1;
                                        this.dataMeca.totalbyMe = (
                                            (this.dataMeca.totalMe * 100) /
                                            this.dataMeca.total
                                        ).toFixed(2);
                                    }
                                } else {
                                    this.dataMeca.totalNotAffected += 1;
                                }
                            }
                            if (inter.name.toLowerCase().includes("elec")) {
                                this.dataElec.total += 1;
                                this.dataElec.totalbyInter = (
                                    (this.dataElec.total * 100) /
                                    this.total
                                ).toFixed(2);
                                if (
                                    inter.affectedBy &&
                                    inter.etat == "EN_COURS"
                                ) {
                                    this.dataElec.totalEnCours += 1;
                                    if (
                                        inter.affectedBy._id == this.account._id
                                    ) {
                                        this.dataElec.totalMe += 1;
                                        this.dataElec.totalbyMe = (
                                            (this.dataElec.totalMe * 100) /
                                            this.dataElec.total
                                        ).toFixed(2);
                                    }
                                } else {
                                    this.dataElec.totalNotAffected += 1;
                                }
                            }
                            if (inter.name.toLowerCase().includes("plom")) {
                                this.dataPlom.total += 1;
                                this.dataPlom.totalbyInter = (
                                    (this.dataPlom.total * 100) /
                                    this.total
                                ).toFixed(2);
                                if (
                                    inter.affectedBy &&
                                    inter.etat == "EN_COURS"
                                ) {
                                    this.dataPlom.totalEnCours += 1;
                                    if (
                                        inter.affectedBy._id == this.account._id
                                    ) {
                                        this.dataPlom.totalMe += 1;
                                        this.dataPlom.totalbyMe = (
                                            (this.dataPlom.totalMe * 100) /
                                            this.dataPlom.total
                                        ).toFixed(2);
                                    }
                                } else {
                                    this.dataPlom.totalNotAffected += 1;
                                }
                            }
                        });
                    });
            });
        }
    }
}
