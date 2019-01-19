import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit
} from "@angular/core";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { DemoService } from "../../../../services/demo.service";

declare var PopulateDashboardCalendar: any;
declare var moment:any;

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

    //totalOrders = '100';
    totalOrderWidth = '';

    totalPendingOrdersWidth = 0;
    totalPendingOrdersWidthInPercent = '';
    
    totalScheduleOrdersWidth = 0;
    totalScheduleOrdersWidthInPercent = '';

    totalCompletedOrdersWidth = 0;
    totalCompletedOrdersWidthInPercent = '';

     dashboardCompany = {
        companies : "",
        locations : "",
        services : ""
    }

    constructor(private _script: ScriptLoaderService, private _demoService: DemoService) { }
    ngOnInit() 
    {
        this.getCustomerStats();
        this.fetchCustomerOrders();
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
                this.totalOrderWidth = this.dashboardCustomer[0].total_order;
                
                //-------------------------Pending Orders Percentage

                this.totalPendingOrdersWidth = Math.round(this.dashboardCustomer[0].pending_orders/(parseInt(this.totalOrderWidth))*100);
                this.totalPendingOrdersWidthInPercent = this.totalPendingOrdersWidth+'%'

                //-------------------------Schedule Orders Percentage

                this.totalScheduleOrdersWidth = Math.round(this.dashboardCustomer[0].scheduled_order/(parseInt(this.totalOrderWidth))*100);
                this.totalScheduleOrdersWidthInPercent = this.totalScheduleOrdersWidth+'%';

                //-------------------------completed Orders Percentage
                
                this.totalCompletedOrdersWidth = Math.round(this.dashboardCustomer[0].completed_order/(parseInt(this.totalOrderWidth))*100);
                this.totalCompletedOrdersWidthInPercent = this.totalCompletedOrdersWidth+'%';

              },
             err => { console.error(err) },
             () => { }
 
         )
     }



     fetchCustomerOrders() {
        this._demoService.getCustomerOrders().subscribe(
            (data:any)=>{
               let orders = data.data.filter(order=> order.order_stage=="2");
               console.log("here is the data response",orders);
               let eventsList = [];
               orders.forEach( order =>{
                  var num = Math.floor(Math.random() * 10 + 1);
                  let classs='';
                  if(num>8)
                  {
                      classs = 'm-fc-event--light m-fc-event--solid-danger'
                  }
                  else if(num>=6)
                  {
                    classs = '"m-fc-event--solid-info m-fc-event--light'
                  }
                  else if(num>=3)
                  {
                    classs = 'm-fc-event--light m-fc-event--solid-warning'   
                  }
                  else
                  {
                    classs = 'm-fc-event--light m-fc-event--solid-info'
                  }
                  console.log(`2018-12-31T13:30:00  - `,    `${order.date}T${order.time}`);
                 
                    eventsList.push({
                        title: order.customer_name,
                        description: `Customer named ${order.customer_name} has ordered a service ${order.services[0].name} whose price is ${order.total_price}. Service description: ${order.services[0].details} ` ,
                        start: moment(`${order.date}T${order.time}`),
                     //    end: moment('2017-08-29T17:30:00'),
                        className: classs
                    });
                 
                  
               });
              
               console.log(eventsList);
               PopulateDashboardCalendar(eventsList);
            }
        )
    }


     
    
}
