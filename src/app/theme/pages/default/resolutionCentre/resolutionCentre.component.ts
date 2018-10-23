import { Component, ViewChild, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { Subscription } from "rxjs/Subscription";

import * as $ from "jquery";
import "datatables.net";
import "datatables.net-bs4";

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

    arrayOfDispute: Object;

    clients: any[];
    dataTable: any;

    constructor(
        private _script: ScriptLoaderService,
        private http: HttpClient,
        private chRef: ChangeDetectorRef
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
    }

    ngAfterViewInit() {
        this._script.loadScripts("app-resolution-centre", [
            "assets/app/js/services.js"
        ]);
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
