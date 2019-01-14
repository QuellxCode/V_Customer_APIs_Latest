import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit
} from "@angular/core";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { DemoService } from "../../../../services/demo.service";

@Component({
    selector: "app-index",
    templateUrl: "./index.component.html",
    styleUrls: ["./fullcalendar.bundle.css"],
    encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit, AfterViewInit {
    lat: number = 51.678418;
    lng: number = 7.809007;
    icon = "assets/demo/default/media/img/food.png";

     dashboardCompany = {
        companies : "",
        locations : "",
        services : ""
    }

    constructor(private _script: ScriptLoaderService, private _demoService: DemoService) { }
    ngOnInit() 
    {
        this.getCustomerStats();
    }
    ngAfterViewInit() {
        this._script.loadScripts("app-index", ["assets/app/js/dashboard.js"]);
    }

     //variable for dashboard stats
     dashboardStat;
     dashboardCustomer;
     getCustomerStats() {
         this._demoService.getCustomerStats().subscribe(
             (data: any) => { 
                 this.dashboardStat = data.data; 
                 this.dashboardCompany = this.dashboardStat.companies;
                 this.dashboardCustomer = this.dashboardStat.customer;
 
                  console.log("here is dashboard response --------------",this.dashboardStat)
                 // console.log("here is dashboard response --------------",this.dashboardcustomer)
              },
             err => { console.error(err) },
             () => { }
 
         )
     }


}
