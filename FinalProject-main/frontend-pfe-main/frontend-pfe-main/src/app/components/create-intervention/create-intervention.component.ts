import { Component, OnInit } from "@angular/core";
import { NotifierService } from "angular-notifier";
import { Intervention } from "src/app/models/intervention";
import { InterventionService } from "src/app/services/intervention.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-create-intervention",
    templateUrl: "./create-intervention.component.html",
    styleUrls: ["./create-intervention.component.scss"],
})
export class CreateInterventionComponent implements OnInit {
    public intervention: Intervention;
    public successMsg: String = "";
    public errorMsg: String = "";
    public role = localStorage.getItem("role");
    constructor(
        private interService: InterventionService,
        private userService: UserService,
        private notifier: NotifierService
    ) {
        this.intervention = new Intervention();
    }

    ngOnInit(): void {
        this.userService.getConnectedUser().subscribe((res: any) => {
            console.log(res);
            this.intervention.createdBy = res.data._id;
        });
    }

    createIntervention() {
        console.log(this.intervention);
        this.interService.createIntervention(this.intervention).subscribe(
            (res: any) => {
                this.successMsg = "Intervention added successfully!";
                setTimeout(() => {
                    if (this.role != "EMPLOYEE") {
                        window.location.href = "/interventions";
                    }
                }, 2000);
            },
            (err) => {
                console.log("err", err);
                this.notifier.show({
                    type: "error",

                    message: "Tous les champs sont Obligatoire SVP!",
                    id: "THAT_NOTIFICATION_ID", // Again, this is optional
                });
            }
        );
    }
}
