import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
    profileSectionHidden: boolean;
    securitySectionHidden: boolean;
    paymentSectionHidden: boolean;
    currencyDDLHidden: boolean;

    constructor(private _script: ScriptLoaderService) { }
    ngOnInit() {
        this.profileSectionHidden = false;
        this.securitySectionHidden = true;
        this.paymentSectionHidden = true;
        this.currencyDDLHidden = true;
    }

    ngAfterViewInit() {
        this._script.loadScripts("app-profile", [
            "//www.amcharts.com/lib/3/plugins/tools/polarScatter/polarScatter.min.js",
            "//www.amcharts.com/lib/3/plugins/export/export.min.js",
            "assets/app/js/services.js"
        ]);
    }

    onSelectionCurrency(value: string) {
        if (value == "Digital") {
            this.currencyDDLHidden = true;
        } else {
            this.currencyDDLHidden = false;
        }
    }

    changingRightTabStatus(value: string) {
        if (value == "profile") {
            this.profileSectionHidden = false;
            this.securitySectionHidden = true;
            this.paymentSectionHidden = true;
        } else if (value == "Security") {
            this.profileSectionHidden = true;
            this.securitySectionHidden = false;
            this.paymentSectionHidden = true;
        } else {
            this.profileSectionHidden = true;
            this.securitySectionHidden = true;
            this.paymentSectionHidden = false;
        }
    }
}
