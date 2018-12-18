import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { EstimateResponseComponent } from "./estimateresponse.component";
import { LayoutModule } from "../../../layouts/layout.module";
import { DefaultComponent } from "../default.component";
import { AgmCoreModule, AgmMap } from "@agm/core";
import { CalendarModule } from "angular-calendar";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarModule } from "primeng/primeng";

import { WizardLeadForm } from "../../../../components/leadFormWizard/leadFormWizard";

import { ServerServices_Services } from "../../../../services/serverServices.services";
import { CustomSharedModule } from "../../custom-shared/custom-shared.module";

const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                component: EstimateResponseComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        SidebarModule,
        RouterModule.forChild(routes),
        CalendarModule.forRoot(),
        LayoutModule,
        CustomSharedModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyABAXCmYooxcSc5GajYQIDIGgM9U2n6vyg"
        }),
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [NgbModule, HttpModule],
    declarations: [EstimateResponseComponent],
    providers: [ServerServices_Services]
})
export class EstimateResponseModule { }
