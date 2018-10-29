import {
    Component,
    OnInit,
    ViewChild,
    NgZone,
    ElementRef,
    AfterViewInit
} from "@angular/core";
import { DragulaService } from "ng2-dragula/ng2-dragula";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { DemoService } from "../../../../services/demo.service";
declare var $: any;

@Component({
    selector: "app-order",
    templateUrl: "./order.component.html",
    styleUrls: [
        "./order.component.css",
        "../../../../../../node_modules/dragula/dist/dragula.css"
    ]
})
export class OrderComponent implements OnInit {
    model;
    formHidden = true;
    orderHistory = true;

    //Dynamic Order Schedule Variable
    scheduleArray: Object[];
    RescheduleModalName: string;
    RescheduleModalPrice: Number;
    RescheduleModalService: string;
    showNoteHide = false;
    dateTimeHide = false;
    disputeButtonCheck = false;

    //detailModalDataVariable
    detailModalName: string;
    detailModalService: string;
    detailModalPrice: Number;

    // lead section arrays
    order_stage_1;      //lead 
    order_stage_2;      // schedule
    order_stage_3;      // completed
    customerOrders;
    servicesToShow = [];

    @ViewChild("search") public searchElementRef: ElementRef;
    constructor(
        private dragulaService: DragulaService,
        private _script: ScriptLoaderService,
        private demo : DemoService
    ) {
        //Dynamic Schedule Array

        this.scheduleArray = [
            {
                name: "Mont Hair",
                service: "Fancy Cutting",
                price: 100,
                scheduleStatus: "company",
                image: "./assets/app/media/img/hair.png"
            },
            {
                name: "Handy Autos",
                service: "Spark Plug Changing",
                price: 60,
                scheduleStatus: "customer",
                image: "./assets/app/media/img/car.png"
            },
            {
                name: "Jane Clinic",
                service: "Fever",
                price: 50,
                scheduleStatus: "company",
                image: "./assets/app/media/img/doctor.jpg"
            },
            {
                name: "Chris Shining",
                service: "One room with bath",
                price: 2.5,
                scheduleStatus: "customer",
                image: "./assets/app/media/img/broom.jpg"
            },
            {
                name: "Mont Hair",
                service: "Head Shaving",
                price: 60,
                scheduleStatus: "company",
                image: "./assets/app/media/img/hair.png"
            }
        ];

        const bag: any = this.dragulaService.find("bag-task1");
        if (bag !== undefined) this.dragulaService.destroy("bag-task1");
        this.dragulaService.setOptions("bag-task1", {
            revertOnSpill: true
        });
    }

    public searchControl: FormControl;

    ngOnInit() {

        // console.log(JSON.parse(localStorage.getItem('currentUser')).success.user_id);

        var text,
            counter = 0;
        $(document).on("click", "#add-service-request", function() {
            counter = counter + 1;
            text = $(this)
                .closest(".m-portlet__head")
                .next()
                .find(".m-widget4")
                .append(
                `
            <div class="m-widget4__item">
                            <div class="m-widget4__img m-widget4__img--logo">
                                <img src="./assets/app/media/img/client-logos/logo5.png" alt="">
                            </div>
                            <div class="m-widget4__info">
								<span class="m-widget4__title">
									New Item ` +
                counter +
                `
								</span>
                                <br>
                                <span class="m-widget4__sub">
									Make Metronic Great Again
								</span>
                            </div>
                            <span class="m-widget4__ext">
								<span class="m-widget4__number m--font-brand">
									+$2500
								</span>
							</span>
                        </div>
        `
                );
        });

        // lead section
        this.fetchCustomerOrder(); 
        
    
    }
    ngAfterViewInit() {
        this._script.loadScripts("app-order", [
            "assets/app/js/bootstrap-datetimepicker.js",
            "assets/app/js/bootstrap-datepicker.js",
            "assets/app/js/bootstrap-timepicker.js"
        ]);
    }

    getDetail(name: string, price: number, service: string) {
        this.RescheduleModalName = name;
        this.RescheduleModalPrice = price;
        this.RescheduleModalService = service;
    }

    setDetailModalData(services) {
        this.servicesToShow = services;
    }

    // lead code

    

    fetchCustomerOrder(){
        this.demo.getCustomerOrders().subscribe(
            (data: any) => { 
                console.log(data.data);
                this.customerOrders = data.data 
                this.order_stage_1 = this.customerOrders.filter(x=>x.order_stage.trim()=="1");
                this.order_stage_2 = this.customerOrders.filter(x=>x.order_stage.trim()=="2");
                this.order_stage_3 = this.customerOrders.filter(x=>x.order_stage.trim()=="3");

                console.log("Pending ", this.order_stage_1, "Scheduled", this.order_stage_2,"Completed",this.order_stage_3);
            //     let res = data.data;
            //    let orderStage = res[0].order_stage;
            //    console.log(orderStage);
            //     if( orderStage == 1){
            //         console.log("inside if0");
            //       this.order_stage_1 = res[0].services;
            //       console.log("service Data "+this.order_stage_1); 
            //     }
              },
            err => console.error(err),
            () => console.log('Done Fetching Lead Data ')

        );
    }

}
