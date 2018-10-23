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

    @ViewChild("search") public searchElementRef: ElementRef;
    constructor(
        private dragulaService: DragulaService,
        private _script: ScriptLoaderService
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

    setDetailModalData(name: string, price: number, service: string) {
        this.detailModalName = name;
        this.detailModalService = service;
        this.detailModalPrice = price;
    }
}
