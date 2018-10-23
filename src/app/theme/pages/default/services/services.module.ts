import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ServicesComponent } from "./services.component";
import { LayoutModule } from "../../../layouts/layout.module";
import { DefaultComponent } from "../default.component";
import { AgmCoreModule, AgmMap } from "@agm/core";
import { CalendarModule } from "angular-calendar";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarModule } from "primeng/primeng";

import { WizardLeadForm } from "../../../../components/leadFormWizard/leadFormWizard";

import { ServerServices_Services } from "../../../../services/serverServices.services";

const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                component: ServicesComponent
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
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyCQlMMVsJXt25cmmii1rx_Ghn0bjRRNdtc"
        }),
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [NgbModule, HttpModule],
    declarations: [ServicesComponent, WizardLeadForm],
    providers: [ServerServices_Services]
})
export class ServiceModule { }
