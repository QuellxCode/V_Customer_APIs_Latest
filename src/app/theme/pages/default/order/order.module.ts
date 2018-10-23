import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AgmCoreModule } from "@agm/core";
import { DragulaModule } from "ng2-dragula";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../../layouts/layout.module";
import { DefaultComponent } from "../default.component";
import { OrderComponent } from "./order.component";

const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                component: OrderComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
        DragulaModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyCQlMMVsJXt25cmmii1rx_Ghn0bjRRNdtc",
            libraries: ["places"]
        }),
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [RouterModule],
    declarations: [OrderComponent]
})
export class OrderModule { }
