import { Component, Input, OnInit } from "@angular/core";
import ApexCharts from "apexcharts";

@Component({
    selector: "app-weekly-target",
    templateUrl: "./weekly-target.component.html",
    styleUrls: ["./weekly-target.component.scss"],
})
export class WeeklyTargetComponent implements OnInit {
    @Input() total;
    @Input() totalByMonth;
    constructor() {}
    ngOnChanges() {
        if (this.total && this.totalByMonth) {
            console.log(((this.totalByMonth / this.total) * 100).toString());
            const options = {
                chart: {
                    height: 370,
                    type: "radialBar",
                },
                colors: ["#2962ff"],
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: "80%",
                        },
                        dataLabels: {
                            name: {
                                show: true,
                                fontSize: "30px",
                            },
                            value: {
                                show: true,
                            },
                        },
                    },
                },
                series: [
                    ((this.totalByMonth / this.total) * 100)
                        .toFixed(2)
                        .toString(),
                ],
                labels: ["Total"],
            };
            const chart = new ApexCharts(
                document.querySelector("#weekly-target-chart"),
                options
            );
            chart.render();
        }
    }
    ngOnInit() {
        /*  const options = {
            chart: {
                height: 370,
                type: "radialBar",
            },
            colors: ["#2962ff"],
            plotOptions: {
                radialBar: {
                    hollow: {
                        size:
                            (
                                (this.totalByMonth / this.total) *
                                100
                            ).toString() + "%",
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            fontSize: "30px",
                        },
                        value: {
                            show: true,
                        },
                    },
                },
            },
            series: [this.totalByMonth],
            labels: ["Total"],
        };
        const chart = new ApexCharts(
            document.querySelector("#weekly-target-chart"),
            options
        );
        chart.render(); */
    }
}
