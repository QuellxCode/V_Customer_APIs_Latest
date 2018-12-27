import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    AfterViewInit,
    TemplateRef,
    ElementRef,
} from "@angular/core";
import { FormControl, FormGroup, Validators, NgForm } from "@angular/forms";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { AgmMap } from "@agm/core";
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from "date-fns";

import { Subject } from "rxjs";
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent
} from "angular-calendar";

import {
    trigger,
    state,
    style,
    animate,
    transition
} from "@angular/animations";

import { ServerServices_Services } from "../../../../services/serverServices.services";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DemoService } from "../../../../services/demo.service";
import { Http } from "@angular/http";
import { ToastrService } from "../../../../services/toastrService.service";

// serverServices for posting the data to server

const colors: any = {
    red: {
        primary: "#ad2121",
        secondary: "#FAE3E3"
    },
    blue: {
        primary: "#1e90ff",
        secondary: "#D1E8FF"
    },
    yellow: {
        primary: "#e3bc08",
        secondary: "#FDF1BA"
    }
};

interface data {
    category_id: number;
    created_at: string;
    details: string;
    duration: number;
    id: number;
    latitude: string;
    longitude: string;
    name: string;
    price: number;
    publish: number;
    rand_id: string;
    staff: string;
    status: string;
    updated_at: string;
}

@Component({
    selector: "app-estimate-response",
    templateUrl: "./estimateresponse.component.html",
    styleUrls: ["./estimateresponse.component.css"],
    animations: [
        trigger("fade", [
            state(
                "void",
                style({
                    transform: "scale(0)",
                    height: "60px",
                    position: "absolute",
                    top: "17%"
                })
            ),

            transition("void => *", [animate(350, style({ transform: "scale(1)" }))]),

            transition("* => void", [animate(400)])
        ])
    ]
    // encapsulation: ViewEncapsulation.None,
})
export class EstimateResponseComponent implements OnInit, AfterViewInit {
    @ViewChild(AgmMap) agmMap: AgmMap;
    @ViewChild("modalContent") modalContent: TemplateRef<any>;
    fileToUpload: File = null;

    isGridView = true;
    viewName = "Grid View";
    isDisplayDetail = false;
    viewDate: Date = new Date();
    visibleSidebar2: boolean;
    visibleSidebar4: boolean;
    formHidden = true;
    selectedFile: File;
    approved = true;
    pending = true;
    rejected = true;
    bidPricesRequests = false;
    allRequestsTabs = true;
    customer_id;

    mainFilterHide = false;
    isListViewHide = false;
    isGridViewHide = true;

     // This check if service in cart is checked or not
     isServiceInCartChecked = false;

    @ViewChild("tref", { read: ElementRef })
    tref: ElementRef;
    @ViewChild("tref1", { read: ElementRef })
    tref1: ElementRef;
    @ViewChild("tref2", { read: ElementRef })
    tref2: ElementRef;
    @ViewChild("search") public searchElementRef: ElementRef;




    time = { hour: 13, minute: 30 };
    meridian = true;

    serverData: any[];

    toggleMeridian() {
        this.meridian = !this.meridian;
    }

    serData: data;
    requestForms: FormGroup;

    constructor(
        private _script: ScriptLoaderService,
        private modal: NgbModal,
        private serverServies_services: ServerServices_Services,
        private _demoService: DemoService,
        private http: Http,
        private toastrService: ToastrService

    ) { }
    reqBeautyCategories: any[];
    ngOnInit() {
        this.reqBeautyCategories = [
            "Facial Care",
            "Hair Removal",
            "Nail Care",
            "Event Planning",
            "Food & Cattring",
            "Pet Services"
        ];
        this.getCat();
        this.getRequestBidResponse();
         this.customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        // alert(this.customer_id);
        this.serverServies_services.getServices().subscribe(data => {
            this.serData = data.data;
            console.log(this.serData);
        });

        this.requestForms = new FormGroup({
            reqName: new FormControl(null, Validators.required),
            reqDetail: new FormControl(null, Validators.required),
            reqCategory: new FormControl("Facial Care", Validators.required),
            reqPrice: new FormControl(null, Validators.required),
            reqDuration: new FormControl(null, Validators.required),
            reqContactNumber: new FormControl(null, Validators.required),
            reqIsPublish: new FormControl(true)
        });


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

        this.reqBeautyCategories = [
            "Facial Care",
            "Hair Removal",
            "Nail Care",
            "Event Planning",
            "Food & Cattring",
            "Pet Services"
        ];

        this.serverServies_services.getServices().subscribe(data => {
            this.serData = data.data;
            console.log(this.serData);
        });





    }

    ngAfterViewInit() {
        this._script.loadScripts("app-services", [
            "//www.amcharts.com/lib/3/plugins/tools/polarScatter/polarScatter.min.js",
            "//www.amcharts.com/lib/3/plugins/export/export.min.js",
            "assets/app/js/services.js",
            "assets/app/js/bookbtn.js"
        ]);
    }

    adjustRadiusMap() {
        setTimeout(() => {
            this.agmMap.triggerResize();
        }, 2000);
    }

    changeView() {
        if (this.isListViewHide) {
            this.isListViewHide = false;
            this.isGridViewHide = true;
            this.viewName = "Grid View";
        } else {
            this.isGridViewHide = false;
            this.isListViewHide = true;
            this.viewName = "List View";
        }
    }
    activeDayIsOpen: boolean = true;

    broadcastServiceRequest(
        recipient,
        serviceCategory,
        value,
        contactNumber,
        message
    ) {
        // After the data submission empty all input fields....
        recipient.value = "";
        serviceCategory.value = "";
        value = "";
        contactNumber.value = "";
        message = "";
    }
    onSubmit() {
        // console.log(this.requestForms.value.reqName, this.requestForms.value.reqDetail,
        //             this.requestForms.value.reqCategory, this.requestForms.value.reqPrice,
        //             this.requestForms.value.reqDuration, this.requestForms.value.reqContactNumber,
        //             this.requestForms.value.reqIsPublish, this.fileToUpload);
        this.serverServies_services
            .storeRequests(
            this.requestForms.value.reqName,
            this.requestForms.value.reqDetail,
            this.requestForms.value.reqCategory,
            this.requestForms.value.reqPrice,
            this.requestForms.value.reqDuration,
            this.requestForms.value.reqContactNumber,
            this.requestForms.value.reqIsPublish,
            this.fileToUpload
            )
            .subscribe(response => {
                console.log(response);
            });
        this.requestForms.reset();
        this.fileToUpload = null;
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }
    /**/
    //Card Button Setting start

    counterBook = 0;
    disabledBook = true;
    activeBook = false;

    //card Button Setting end


    //Map buttons Start
    isMapDetail = false;
    counterBookMap = 0;
    disabledBookMap = true;
    activeBookMap = false;
    disabledApproveBtn = true;
    activeApproveBtn = false;
    //Map button End

    //side pop-up
    showServices = false;
    showOrderHistory = false;
    showInfo = false;

    //Info Modal variable Start here

    companyInfoTitle = "";
    priceInfoTitle = "";
    serviceInfoTitle = "";

    //Info Modal variable End here

    //Right Side Bar variables Start

    proceedCounter = 0;
    activePaymentTab = false;
    activeScheduleTab = false;
    activeItemTab = true;
    activeMoreTab = false;
    moreCheck = false;
    coupon1check = false;
    coupon2check = false;
    coupon3check = false;
    orderNowCheck = false;
    hideTermsModal = true;
    hideTermsModal1 = true;

    //Right Side Bar variables End

    lang: any;
    lat: any;
    lati: number = 51.678418;
    lng: number = 7.809007;

    enabledOrderNowbutton: boolean = true;
    checked: boolean = false;
    serviceCounter: number = 0;
    enabledPaymentButton: boolean = false;
    itemsArray = [
        { name: "Oil & Oil Filter Change", price: "12.00" },
        { name: "Spark Plugs Changing", price: "60.00 " }
    ];

    itemsArray2 = [
        { name: "Fancy Cutting", price: "100.00" },
        { name: "Head Shaving", price: "50.00 " }
    ];

    orderButtonConter = 0;
    testVariable = false;
    deleted = true;
    addNewPaymentCardHide = false;
    public categories;
    public subCategories;
    public requestBidResponse;
    public serviceGlobe;
    public subCatServices;
    public serviceLocations;
    disabled = true;
    disabledServicesDD = true;
    //@ViewChild('triggerServiceDD')triggerServiceDD:ElementRef;


    getCat() {
        this._demoService.getCategories().subscribe(
            (data: any) => { this.categories = data.data; console.log('Categories = ', this.categories) },
            err => console.error(err),
            () => console.log('Done Fetching Categories')

        );
    }

    onChange(value) {
        this._demoService.getSubCategories(value).subscribe(
            (data: any) => { this.subCategories = data.data; console.log(data); },
            err => console.error(err),
            () => {
                console.log('Done Fetching Sub Categories');
                this.disabled = false;
               
            }

        );
    }

    subCatService(value) {
        this._demoService.getSubCategoryServices(value).subscribe(
            (data: any) => { this.subCatServices = data.data; console.log(data); },
            err => console.error(err),
            () => {
                console.log('Done Fetching Service using subcat rand_id');
                this.disabledServicesDD = false;
               // this.triggerServiceDD.nativeElement.click();
            
            }

        );
    }



    onCheckedUpdate(event: Event) {
        if ((<HTMLInputElement>event.target).checked) {
            this.visibleSidebar4 = true;
            this.serviceCounter++;
        } else {
            this.visibleSidebar4 = false;
            this.serviceCounter--;
        }
    }

    onBook(element: Element) {
        if (!this.tref.nativeElement.checked) {
            this.tref.nativeElement.checked = true;
            this.serviceCounter++;
        }
        console.log();
        this.visibleSidebar4 = true;
        this.enabledPaymentButton = true;
        if (element.classList[2] == "btn-default") {
            element.classList.remove("btn-default");
            element.classList.add("btn-primary");
        }
    }

    onOrderNow(event: Event) {
        if ((<HTMLInputElement>event.target).checked) {
            this.orderButtonConter++;
        } else {
            this.orderButtonConter--;
        }

        if (this.itemsArray.length == this.orderButtonConter) {
            this.enabledOrderNowbutton = false;
        } else {
            this.enabledOrderNowbutton = true;
        }
    }

    onDelete(value: number) {
        this.itemsArray.splice(value, value + 1);
        if (this.orderButtonConter != 0) {
            this.orderButtonConter--;
        }
    }

    onDelete1(value: number) {
        this.itemsArray2.splice(value, value + 1);
        if (this.orderButtonConter != 0) {
            this.orderButtonConter--;
        }
    }

    updateInfoModal(company: string, price: string, title: string) {
        this.companyInfoTitle = company;
        this.priceInfoTitle = price
        this.serviceInfoTitle = title
    }

    showProceedButton(event: Event) {
        if ((<HTMLInputElement>event.target).checked) {
            this.proceedCounter++;
            this.hideTermsModal1 = false;
        } else {
            this.hideTermsModal1 = true;
            if (this.proceedCounter == 0) {
                return;
            }
            this.proceedCounter--;
        }
    }

    showProceedButton1(event: Event) {
        if ((<HTMLInputElement>event.target).checked) {
            this.proceedCounter++;
            this.hideTermsModal = false;
        } else {
            this.hideTermsModal = true;
            if (this.proceedCounter == 0) {
                return;
            }
            this.proceedCounter--;
        }
    }

    showBookButton(event: Event) {
        if ((<HTMLInputElement>event.target).checked) {
            this.counterBook++;
            this.activeBook = true;
            this.disabledBook = false;
        } else {
            if (this.counterBook <= 1) {
                this.activeBook = false;
                this.disabledBook = true;
            }
            if (this.counterBook == 0) {
                return;
            }
            this.counterBook--;
        }
    }


    activeTab(value: string) {
        if (value == "items") {
            this.activePaymentTab = false;
            this.activeItemTab = true;
            this.activeMoreTab = false;
            this.activeScheduleTab = false;
        } else if (value == "payment") {
            this.activePaymentTab = true;
            this.activeItemTab = false;
            this.activeMoreTab = false;
            this.activeScheduleTab = false;
        } else if (value == "schedule") {
            this.activePaymentTab = false;
            this.activeItemTab = false;
            this.activeMoreTab = false;
            this.activeScheduleTab = true;
        }
        else {
            this.activePaymentTab = false;
            this.activeItemTab = false;
            this.activeMoreTab = true;
            this.activeScheduleTab = false;
        }
    }


    thanksUpdate() {
        this.visibleSidebar2 = false
        this.proceedCounter = 0;
        this.activePaymentTab = false;
        this.activeItemTab = true;
        this.activeMoreTab = false;
        this.moreCheck = false;
        this.coupon1check = false;
        this.coupon2check = false;
        this.coupon3check = false;
        this.orderNowCheck = false;
    }



    showBookButtonMap(event: Event) {
        if ((<HTMLInputElement>event.target).checked) {
            this.counterBookMap++;
            this.activeBookMap = true;
            this.disabledBookMap = false;
        } else {
            if (this.counterBookMap <= 1) {
                this.activeBookMap = false;
                this.disabledBookMap = true;
            }
            if (this.counterBookMap == 0) {
                return;
            }
            this.counterBookMap--;
        }
    }


    approveBig(event: Event) {
        if ((<HTMLInputElement>event.target).checked) {

            this.activeApproveBtn = true;
            this.disabledApproveBtn = false;
        
        } else {
           
                this.activeApproveBtn = false;
                this.disabledApproveBtn = true;
          
          
        }
    }

    public imageUrl = 'http://www.sharjeelkhan.ca/vease/vease-app/application-file/img/';

    companiesQuotedService;
    serviceApproved_Granted;

    getRequestBidResponse() {
        this._demoService.getBidResponseApi().subscribe(
            (data: any) => {
                 this.requestBidResponse = data.data;

                 console.log('Bid Response is here  = ', this.requestBidResponse);
                 },
            err => console.error(err),
            () => console.log('Done Fetching requestBidResponse')

        );
    }

    

    
    bidRequest(form_data: NgForm) 
    {

        this._demoService.bidRequestApi(
            //this.customer_id;
            form_data.value.category_name,
            form_data.value.subcategory_name,
            form_data.value.service_name,
            form_data.value.description,
            form_data.value.contact,
            form_data.value.price,
            this.selectedFile[0]
        )
            .subscribe(
            (data: Response) => {
                console.log("data", data);
                this.toastrService.showSuccessMessages("Request Successfully Submitted!");
              
                form_data.resetForm();

                return true;
            },
            error => {
                this.toastrService.showErrorMessages("Error in Submiting Request. Error: " + error.message + "<br> Try Resubmitting The Form");
                console.error("Error in adding Request!");
            },
            () => { }

            );
    }

    //variable declare here
    service_rand_id;
    
    servicesIds = [];
    serviceCheck(service_id)
    {

        this.servicesIds.push(service_id);
        //alert(this.servicesIds);
        
    }

    company_id_of_quoted_price;
    request_bid_rand_id;
    companyDataToCart(company_id, request_bid_response_rand_id)
    {
        this.company_id_of_quoted_price = company_id;
        this.request_bid_rand_id = request_bid_response_rand_id;
        alert("response "+this.request_bid_rand_id);
        alert("company "+ this.company_id_of_quoted_price);
        
    }

    approveRequestBid() {
    
        this._demoService.bidRequestApprove(this.request_bid_rand_id)
            .subscribe(
            (response: any) => {
               // this.toastrService.showSuccessMessages("Item Added to Cart Successfully !");
            },
            (err) => { console.error(err) },
            () => { console.log("Status 200 Posted!")
            this.approveAndAddtoCart();
        }
            )
    }

    approveAndAddtoCart() {
       
       
       
        console.log('Customer =>' + this.customer_id + ' Services ids => ' + this.servicesIds + ' Company=> ' + this.company_id_of_quoted_price);
        this._demoService.postSevicestoCart2(this.customer_id, this.servicesIds, this.company_id_of_quoted_price)
            .subscribe(
            (response: any) => {
                this.toastrService.showSuccessMessages("Item Added to Cart Successfully !");
            },
            (err) => { console.error(err) },
            () => { console.log("Status 200 Posted!") }
            )
    }

   

    showRequestTabs(value){
        if(value == "all"){
            this.approved = true;
            this.pending = true;
            this.rejected = true;
        }
        else if(value == "approved"){
            this.approved = true;
            this.pending = false;
            this.rejected = false;
        }
        else if(value == "pending"){
          this.approved = false;
            this.pending = true;
            this.rejected = false;
        }

        else if(value == "rejected"){
            this.approved = false;
            this.pending = false;
            this.rejected = true;
        }
       
    }


    onFileSelected(event) {
        console.log(event);
        this.selectedFile = <File>event.target.files;
    }

    showQuoted() {
        this.bidPricesRequests = true;
        this.allRequestsTabs = false;
        this.formHidden = true;
    }


    showAllTabs(){
        this.bidPricesRequests = false;
        this.allRequestsTabs = true;
    }


    
    // Cart Item Index
    termsAndConditonIndex;

    //Cart Items' service index
    selectedServiceParentIndex;

     // CartItems Card Index
     agreedCartItemIndex;
     approveBtnHide = false;
    approvedBtn(event: Event, index) {
        this.approveBtnHide = true;
        this.termsAndConditonIndex = index;
        console.log("Terms Index is =>", this.termsAndConditonIndex);

        // this.selectedServiceParentIndex = index;
        console.log("Service Index is =>", this.selectedServiceParentIndex);

        this.isServiceInCartChecked = false;
        if ((<HTMLInputElement>event.target).checked) {
            this.proceedCounter++;
            this.hideTermsModal = false;
            this.agreedCartItemIndex = index;
        } else {
            this.hideTermsModal = true;
            this.agreedCartItemIndex = -1;
            if (this.proceedCounter == 0) {
                this.approveBtnHide = false;
                return;
            }
            this.proceedCounter--;
        }
    }

    
    servicesInCartRadiosFirstScreen( event, index, parentIndex) {

          // Check for looking what is selected service parent's index
          this.selectedServiceParentIndex = parentIndex;

    
        this.isServiceInCartChecked = event.target.checked;
        

        console.log('event is => ', event.target.checked);
        console.log('index is => ', index);
        


    }

    showAlert(){
        alert("Approved");
    }

    isProceedFirstEnabled = false;
    // This has all the cartItems and its services in it
    cartServices = [];
    
    user_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
    
    // Permissions array for search by service functionality
    permissions2 =[];


    getServicesToCart() {
        this.isProceedFirstEnabled = true;
        this.agreedCartItemIndex = undefined;
        this._demoService.getServicesToCart(this.user_id).subscribe(
            (response: any) => {
                this.cartServices = response.data; console.log("this is cart Items response =>", this.cartServices);
                

                /*  This Code will push services' rand_id into permissions2 array
                    and later will be used as a check for disabling services
                    checkboxes in SEARCH BY SERVICE section
                */
                this.permissions2 = [];
                this.cartServices.forEach(item => {
                    item.service.forEach(service => {
                        this.permissions2.push(service.rand_id);
                    });
                });

                console.log("permissions2 => ",this.permissions2);
                
            },
            err => {
                console.error(err);
            },
            () => { console.log("Cart Fetching is working") }

        )
    }



}


