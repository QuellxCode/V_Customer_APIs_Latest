import { Response } from '@angular/http';
import { Http } from '@angular/http';
import { DemoService } from './../../../../services/demo.service';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    AfterViewInit,
    TemplateRef,
    ElementRef,
    NgZone
} from "@angular/core";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { } from "googlemaps";
import { AgmMap, MapsAPILoader } from "@agm/core";
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
    selector: "app-services",
    templateUrl: "./services.component.html",
    styleUrls: ["./services.component.css"],
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
export class ServicesComponent implements OnInit, AfterViewInit {
    @ViewChild("tref", { read: ElementRef })
    tref: ElementRef;
    @ViewChild("tref1", { read: ElementRef })
    tref1: ElementRef;
    @ViewChild("tref2", { read: ElementRef })
    tref2: ElementRef;
    @ViewChild(AgmMap) agmMap: AgmMap;
    @ViewChild("modalContent") modalContent: TemplateRef<any>;
    @ViewChild("search") public searchElementRef: ElementRef;
    fileToUpload: File = null;

    isGridView = false;
    viewName = "Grid View";
    isListViewHide = true;
    isGridViewHide = true;
    isDisplayDetail = true;
    viewDate: Date = new Date();
    paymentCheckTickHide = false;
    isCustomer = true;

    /**/
    companies: any = [];
    cityName = '';
    currentService = {
        name: "",
        price: "",
        details: "",

    };





    /*  currentService= {
          name: "",
          price: "",
          details:''};*/
    /**/

    //view button start

    mapView = true;
    listGridViewContent = true;
    moreDetailShow = false;
    isHeaderShow = false;
    isBreadCrum = true;

    //view button end

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
    formHidden = true;

    time = { hour: 13, minute: 30 };
    meridian = true;

    serverData: any[];

    toggleMeridian() {
        this.meridian = !this.meridian;
    }

    serData: data;
    requestForms: FormGroup;
    visibleSidebar4: boolean;
    visibleSidebar2: boolean;
    enabledOrderNowbutton: boolean = true;
    checked: boolean = false;
    serviceCounter: number = 0;
    enabledPaymentButton: boolean = false;
    mainFilterHide = false;
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
    constructor(
        private _script: ScriptLoaderService,
        private modal: NgbModal,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private serverServies_services: ServerServices_Services,
        private _demoService: DemoService,
        private http: Http
    ) {
        // this.itemsArray=[{name:"Oil & Oil Filter Change", price: 12.00},
        //                  { name:"Spark Plugs Changing", price: 60.00}];
    }

    reqBeautyCategories: any[];



    public searchControl: FormControl;

    /* ------------------ AWS CODE BEGIN ---------------------- */

    //       Companies, Locations and Services --------- Plus User Lat Long & radius

    longitude: any; // User Longitude
    latitude: any;  // User latitude
    radiusInMeters = 20000;
    radiusInKm = this.radiusInMeters / 1000;

    // User marker Icon
    icon = {
        url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/96290-200.png',
        scaledSize: {
            width: 50,
            height: 50
        }
    }

    services = [];  // This will have all the services that are reyurned against a company location
    company_locations = [];
    current_company_location;
    selectedIndex;
    selectedParentIndex;

    preloader: boolean = true;  // While showing Companies & Locations this loader will trigger until fetched
    preloaderServices: boolean = true; // While showing services this loader will trigger until fetched

    public company_and_locations = [];

    selectedServices;

    // List of Markers for companies' locations
    markers: Array<{ latitude: number, longitude: number }> = [
        { 'latitude': 33.6844, 'longitude': 73.0479 },
    ];

    // Filtered locations based on user radius selection from front end
    filteredMarkers = [];


    /* ------------------ AWS CODE END ---------------------- */

    ngOnInit() {
        // console.log(localStorage.getItem('token'));

        this.getUserLocation();  // Return User Location Lat lng
        // this.getCompanyServices();
        // this.getCompanies();



        this.searchControl = new FormControl();
        // this.mapsAPILoader.load().then(() => {
        //     const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        //         types: ['address']
        //     });
        //     autocomplete.addListener('place_changed', () => {
        //         this.ngZone.run(() => {
        //             const place: google.maps.places.PlaceResult = autocomplete.getPlace();
        //             //  this.clientPlacess = place;
        //             // console.log(this.clientCity);

        //             //    for country
        //             var address_components = autocomplete.getPlace().address_components;

        //             if (place.geometry === undefined || place.geometry === null) {
        //                 return;
        //             }

        //             this.lat = place.geometry.location.lat();
        //             this.lang = place.geometry.location.lng();
        //             this.lati = this.lat;
        //             this.lng = this.lang;

        //         });
        //     });
        // });

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
            // console.log(data.data);
            this.serData = data.data;
            //  console.log(this.serData);
            // console.log('this is serverData');
            // console.log(this.serverData);
            // console.log('this is interface data');
            // console.log(this.serData);
            // console.log(serData[0].price + ' ' + serData[0].publish);
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
    }

    ngAfterViewInit() {
        this._script.loadScripts("app-services", [
            "//www.amcharts.com/lib/3/plugins/tools/polarScatter/polarScatter.min.js",
            "//www.amcharts.com/lib/3/plugins/export/export.min.js",
            "assets/app/js/services.js",
            "assets/app/js/bootstrap-datetimepicker.js",
            "assets/app/js/bootstrap-datepicker.js",
            "assets/app/js/bootstrap-timepicker.js"
        ]);
    }


    //Get User Location. Map will be centered here
    getUserLocation() {
        if (navigator.geolocation) {
            // 🗺️ yep, we can proceed!
            navigator.geolocation.getCurrentPosition((position) => {
                {
                    this.longitude = position.coords.longitude;
                    this.latitude = position.coords.latitude;
                    console.log(`longitude: ${this.longitude} | latitude: ${this.latitude}`);
                    // this.getCompanies();
                    this.getCompaniesNew();
                    console.log('user_lat => ' + this.latitude + "| user_lng => " + this.longitude);
                }
            });
        } else {
            // no can do
            console.log("Your Browser Doesn't Support Location!");
        }
    }

    // GET COMPANIES & LOCATIONS OLD CODE When the response was chaotic (changed on 24th October to getCompaniesNew())
    getCompanies() {
        let rawData = [];
        this._demoService.getCompanyAndTheirLocationsWithLatLng(this.latitude, this.longitude, this.radiusInKm).subscribe(
            (response: any) => {
                console.log("Radius is => " + this.radiusInKm); console.log("Response =", response);
                rawData = response.data;

                // Check if email KEY exists
                this.company_and_locations = rawData.filter(x => x["email"] != undefined);

                // OLD CODE with for each
                // rawData.forEach(x => {
                //     if(x["email"] != undefined)
                //     {
                //         this.company_and_locations.push(x);
                //     }
                // })

                this.company_and_locations.forEach(x => {
                    x["locations"] = rawData.filter(y => {
                        if (y["user_id"] == x["id"]) {
                            this.markers.push({ 'latitude': parseFloat(y.lat), 'longitude': parseFloat(y.lng) })
                            //  console.log(y.lat + " " + y.lng);
                            // console.log(y);
                            return x;
                        }
                        else {
                            return null;
                        }
                    }
                    )
                });
                console.log(this.markers);
                console.log(this.company_and_locations);
                this.preloader = false;


            },
            (err) => { console.error(err) },
            () => { console.log('Data Fetched.') }
        )

        /* OLD CODE */
        // this._demoService.getCompanies().subscribe(
        //     (response:any) => { this.companies = response.data;},
        //     err => { console.error(err)},
        //     () => { console.log("ALL Companies FETCHED!") }
        // )
    }


    //  NEW CODE ON 24th october to fetch companies and locations
    getCompaniesNew() {

        this._demoService.getCompanyAndTheirLocationsWithLatLng(this.latitude, this.longitude, this.radiusInKm).subscribe(
            (response: any) => {
                console.log("Radius is => " + this.radiusInKm); console.log("Response =", response);
                // Check if email KEY exists
                console.log(this.selectedParentIndex + " -> " + this.selectedIndex);
                this.company_and_locations = response.data;
                // For Pushing Markers in markers Array
                this.company_and_locations.forEach(x=> { x.location.forEach( y=>{
                    this.markers.push({ 'latitude': parseFloat(y.lat), 'longitude': parseFloat(y.lng) })
                    })

                });
                console.log(this.markers);
                console.log(this.company_and_locations);
                this.preloader = false;


            },
            (err) => { console.error(err) },
            () => { console.log('Data Fetched.') }
        )

    }

    //This fetches all the services of the selected location OLD CODE (changed on 24th october to FetchCompaniesLocationSerices())
    FetchCompanyLocationServices() {
        this.preloaderServices = true;
        console.log("This here now ! " + this.current_company_location.locations[this.selectedIndex].rand_id);
        // console.log(this.selectedIndex);
        console.log(this.current_company_location);
        this._demoService.getCompanyLocationServices(this.current_company_location.locations[this.selectedIndex].rand_id).subscribe(
            (res: any) => {
                console.log("This here then ! =>" + this.current_company_location.locations[this.selectedIndex].rand_id);
                console.log(this.services = res.data);
                // this.preloaderServices = false;
            },
            (err) => { console.error(err) },
            () => {
                console.log('Done Fetching Services');
                this.preloaderServices = false;
            }
        );
    }


    //  NEW CODE ON 24th october to fetch Services against locations
    FetchCompanyLocationServicesNew() {
        this.preloaderServices = true;
        console.log("This here now ! " + this.current_company_location.location[this.selectedIndex].rand_id);
        this._demoService.getCompanyLocationServices(this.current_company_location.location[this.selectedIndex].rand_id).subscribe(
            (res: any) => {
                console.log(" Current_Company_Location" + this.current_company_location.data);
                console.log("hello selected => " + this.selectedIndex);
                console.log("This here then ! =>" + this.current_company_location.location[this.selectedIndex].rand_id);
                console.log(this.services = res.data);
                // this.preloaderServices = false;
            },
            (err) => { console.error(err) },
            () => {
                console.log('Done Fetching Services');
                this.preloaderServices = false;
            }
        );
    }


    sideInfoPop(value: string, location, index: number, parentIndex: number) {
        if (value == "service") {
            // alert(this.showServices);
            this.showServices = true;
            // alert(this.showServices);
            // setTimeout(()=> {
            //     alert(this.showServices);
            // },2000)

            this.selectedIndex = index;
            this.selectedParentIndex = parentIndex;
            console.log(this.current_company_location = location);
            // this.FetchCompanyLocationServices(); OLD METHODE
            this.FetchCompanyLocationServicesNew();

            // this.showOrderHistory = false;
            // this.showInfo = false;
        } else {
            alert('in else');
            this.showServices = false;
            this.showOrderHistory = false;
            this.showInfo = true;
        }
    }



    // getCompanies() {
    //     this._demoService.getCompanies().subscribe(
    //         (response:any) => { /*console.log("Response =" , response);*/ this.companies = response.data;/* this.currentService = this.services[0]*/
    //      /* console.log("Response = " , this.companies);*/
    //     localStorage.setItem('company_id', response.data['0'].user_id);
    // },

    //         err => { console.error(err)},
    //         () => { console.log("ALL Companies FETCHED!") } 
    //     )
    // }


    // getCompanyServices() {
    //     this._demoService.getCompanyServices().subscribe(
    //         (response:any) => { console.log("Response =" , response); this.services = response.data;

    //         /* this.currentService = this.services[0]*/},

    //         err => { console.error(err)},
    //         () => { console.log("Services FETCHED!") }
    //     )
    // }


    // searchCity(){
    //     this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/company-service/'+this.cityName)
    //     .subscribe(
    //       (response:any) => {
    //             const weatherCity = response.json();
    //             console.log("WEATHER CITY IS:" , weatherCity);
    //       }

    //     )
    // }

    // getCompanyService() {
    //     this._demoService.getCompanyServices().subscribe(
    //         (response:any) => { console.log("Response =" , response.data); this.cservices = response.data.services;
    //         console.log("THIS IS TEXT TEST" , this.cservices);
    //     },
    //         err => { console.error(err)},
    //        /* () => { console.log("Company Services FETCHED!") } */
    //     )
    // }

    // postServicesCart() {
    //     this._demoService.postServiceCart().subscribe(
    //         (response:any) => { console.log("Response =" , response);},
    //         err => { console.error(err)},
    //         () => { console.log("Services added to cart") } 
    //     )
    // }



    // getIndividualCompanyServices() {
    //     this._demoService.getIndividualServices().subscribe(
    //         response => { console.log("Response =" + response)},

    //         err => { console.error(err)},
    //         () => { console.log(" Individual Service FETCHED!") } 
    //     )
    // }


    adjustRadiusMap() {
        setTimeout(() => {
            this.agmMap.triggerResize();
        }, 2000);
    }

    selectService(i) {
        this.currentService = this.services[i];
    }

    changeView() {
        this.listGridViewContent = false;
        this.mapView = false;
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

    //Calendar
    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                // this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                // this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [
        {
            start: subDays(startOfDay(new Date()), 1),
            end: addDays(new Date(), 1),
            title: "A 3 day event",
            color: colors.red
            // actions: this.actions
        },
        {
            start: startOfDay(new Date()),
            title: "An event with no end date",
            color: colors.yellow
            // actions: this.actions
        },
        {
            start: subDays(endOfMonth(new Date()), 3),
            end: addDays(endOfMonth(new Date()), 3),
            title: "A long event that spans 2 months",
            color: colors.blue
        },
        {
            start: addHours(startOfDay(new Date()), 2),
            end: new Date(),
            title: "A draggable and resizable event",
            color:
            colors.yellow /*,
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true*/
        }
    ];

    activeDayIsOpen: boolean = true;

    /*
       dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
         if (isSameMonth(date, this.viewDate)) {
             if (
               (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
               events.length === 0
             ) {
               this.activeDayIsOpen = false;
             } else {
               this.activeDayIsOpen = true;
               this.viewDate = date;
             }
           }
         }
         handleEvent(action: string, event: CalendarEvent): void {
           this.modalData = { event, action };
           this.modal.open(this.modalContent, { size: 'lg' });
         }
   */

    //Calendar Ends

    // seding data to serve
    // submitServices(name, details, value, staff, price, duration, location, latitude, longitude, publish) {
    //     // console.log(value.value, ' ', publish.value);
    //     // console.log(this.category_id);
    //     console.log(name.value, details.value, value.value,staff.value, price.value, duration.value, location.value, longitude.value, latitude.value, publish.value);
    //     this.serverServies_services.storeServices(name.value, details.value, value.value,staff.value, price.value, duration.value, location.value, longitude.value, latitude.value, publish.value)
    //        .subscribe(
    //            (response) => {
    //                console.log(response);
    //            }
    //        )
    //     // After the data submission empty all input fields....
    //        name.value = '';
    //        details.value = '';
    //        value.value=null;
    //        staff.value = '';
    //        price.value = '';
    //        duration.value = null;
    //        location.value = '';
    //        latitude.value = '';
    //        longitude.value = '';
    //        publish = null;
    // }

    // For getting data from server call this function to get data on console....
    // getTasks() {
    //     this.serverServies_services.getTasks()
    //     .subscribe(
    //         (data) => {
    //             console.log(data);
    //         }
    //     )
    // }

    broadcastServiceRequest(recipient, serviceCategory, contactNumber) {
        // After the data submission empty all input fields....
        recipient.value = "";
        serviceCategory.value = "";
        // value = '';
        contactNumber.value = "";
        // message = '';
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

    // sideInfoPop(value: string) {
    //     if (value == "history") {
    //         this.showServices = false;
    //         this.showOrderHistory = true;
    //         this.showInfo = false;
    //     } else if (value == "service") {
    //         this.showServices = true;
    //         this.showOrderHistory = false;
    //         this.showInfo = false;
    //     } else {
    //         this.showServices = false;
    //         this.showOrderHistory = false;
    //         this.showInfo = true;
    //     }
    // }



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

    isMoreDetail() {
        this.moreDetailShow = true;
        this.mapView = false;
        this.listGridViewContent = true;
        this.isHeaderShow = true;
        this.isBreadCrum = false;
    }

    backToContent() {
        this.moreDetailShow = false;
        this.mapView = false;
        this.listGridViewContent = false;
        this.isHeaderShow = false;
        this.isBreadCrum = true;
    }

    mapViewChanging() {
        this.listGridViewContent = true;
        this.mapView = true;
        this.isDisplayDetail = true;
        this.isListViewHide = true;
        this.isGridViewHide = true;
    }

}
