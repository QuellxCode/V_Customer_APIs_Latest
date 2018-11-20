import { Component, ViewChild, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { Subscription } from "rxjs/Subscription";

import * as $ from "jquery";
import "datatables.net";
import "datatables.net-bs4";
import { DemoService } from "../../../../services/demo.service";
import { NgForm } from "@angular/forms";
import { ToastrService } from "../../../../services/toastrService.service";

@Component({
    selector: "app-resolution-centre",
    templateUrl: "./resolutionCentre.component.html",
    styleUrls: ["./resolutionCentre.component.css"]
})
export class ResolutionCentreComponent {
    firstRowActive = false;
    secondRowActive = false;
    disputeRightSideActive = false;
    mainFilterHide = false;
    serviceName;
    services;
    arrayOfDispute: Object;

    clients: any[];
    dataTable: any;

    // selectedServices = [];
    servicesToShow = [];
    service_rand_id;
    service_company_id;

    // lead section arrays
    order_stage_3;      // completed
    companyID;
    customerOrders;

    firstMessage = true;
    preloader: boolean = true;

    constructor(
        private _script: ScriptLoaderService,
        private http: HttpClient,
        private chRef: ChangeDetectorRef,
        private demo: DemoService,
        private toastrService: ToastrService
    ) {
        this.arrayOfDispute = [
            {
                id: "1",
                company: "Handy Autos",
                service: " Oil & Oil Filter Changing",
                status: "Resolved"
            },
            {
                id: "2",
                company: "Mont Hair",
                service: "Fancy Cutting",
                status: " In-Progress"
            }
        ];
    }

    ngOnInit() {
        //const table: any = $('table');
        //this.dataTable = table.DataTable();

        $(document).ready(function() {
            const table: any = $("#datatable");
            var users = table.DataTable({
                dom: "t"
            });
            $("#customSearchBox").keyup(function() {
                users.search($(this).val()).draw();
            });
        });

        this.fetchCustomerOrder();
        // this.setDetailModalData();
    }

    ngAfterViewInit() {
        this._script.loadScripts("app-resolution-centre", [
            "assets/app/js/services.js"
        ]);
    }



    // getServiceName(services) {
    //     let servicesName =
    //     this.servicesToShow = services;
    // }

    sendCompanyID_Service_id(company_id, rand_id) {
        this.service_company_id = company_id;
        this.service_rand_id = rand_id;
        console.log("service added by company " + this.service_company_id);
        console.log("service rand_id " + this.service_rand_id);
    }


    resolutionCenter(form_data: NgForm) {

        this.demo.postResolutionCenter(
            this.service_company_id,
            this.service_rand_id,
            form_data.value.order_status,
            form_data.value.description
        )
            .subscribe(
            (data: Response) => {
                console.log(data);
                console.log(form_data);
                form_data.resetForm();
                this.toastrService.showSuccessMessages("Resolution Added Successfully !");
            },
            error => {
                console.error("Error posting resolution center info!");
                this.toastrService.showErrorMessages("Error In Adding Resolution Center. Error: " + error.message + "<br> Try Resubmitting The Form");
            }
            );
    }

    fetchCustomerOrder() {
        this.demo.getCustomerOrders().subscribe(
            (data: any) => {
                console.log(data.data);
                     
                this.firstMessage = false;
                this.preloader = false;
               
                this.customerOrders = data.data
                this.order_stage_3 = this.customerOrders.filter(x => x.order_stage.trim() == "3");
                console.log("Completed", this.order_stage_3);
                this.companyID = this.order_stage_3;
                console.log(this.companyID);

            },
            err => console.error(err),
            () => console.log('Done Fetching Lead Data ')

        );
    }



    activeRow(index: number) {
        this.disputeRightSideActive = true;

        if (index == 1) {
            this.secondRowActive = false;
            this.firstRowActive = true;
        } else {
            this.firstRowActive = false;
            this.secondRowActive = true;
        }
    }
}
