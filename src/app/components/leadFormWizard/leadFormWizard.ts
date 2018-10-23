import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../helpers';
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';



@Component({
    selector: "wizard-lead-form",
    templateUrl: "./leadFormWizard.html",
    styleUrls: ["./leadFormWizard.css"],
    encapsulation: ViewEncapsulation.None,
})
export class WizardLeadForm implements OnInit, AfterViewInit {

    Categorgy = "health";


    constructor(private _script: ScriptLoaderService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.loadScripts('wizard-lead-form',
            ['assets/demo/default/custom/components/forms/wizard/wizard.js']);

    }

}
