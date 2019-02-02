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
    NgZone, ChangeDetectorRef, OnDestroy
} from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators, ReactiveFormsModule } from "@angular/forms";
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

import { NgbCalendar, NgbDatepickerConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";
import { ToastrService } from '../../../../services/toastrService.service';
import { CartComponent } from '../../custom-shared/cart/cart.component';

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
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
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

    itemlistTab = true;
    scheduletab = true;
    paymenttab = true;

    /**/
    companies: any = [];
    cityName = '';
    currentService = {
        name: "",
        price: "",
        details: "",

    };

    confirmation = false;

    application_fee_price;
    application_fee_percentage;
    total_fee_ammount;


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
    hiddenScheduleProcceed = false;
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
        private http: Http,
        private config: NgbDatepickerConfig,
        private calendar: NgbCalendar,
        private toastrService: ToastrService,
        private cd: ChangeDetectorRef
    ) {
        // this.itemsArray=[{name:"Oil & Oil Filter Change", price: 12.00},
        //                  { name:"Spark Plugs Changing", price: 60.00}];

        // customize default values of datepickers used by this component tree
        // this.config.minDate = { year: 2010, month: 1, day: 1 };

        const currentDate : Date = new Date();

        this.config.minDate = { year:currentDate.getFullYear(), month:currentDate.getMonth()+1, day: currentDate.getDate() };
        this.config.maxDate = { year: 2050, month: 12, day: 31 };

        // days that don't belong to current month are not visible
        // config.outsideDays = 'hidden';

        // weekends are disabled
        this.config.markDisabled = (date: NgbDate) => this.calendar.getWeekday(date) >= 6 || (date.month == 11 && date.day == 7);
        // const dateDisabled = (date: NgbDate, current: {month: number}) => date.day === 13;
    }


    reqBeautyCategories: any[];



    public searchControl: FormControl;

    /* ------------------ AWS CODE BEGIN ---------------------- */

    //       Companies, Locations and Services --------- Plus User Lat Long & radius

    longitude: any; // User Longitude
    latitude: any;  // User latitude
    savedMarkers;
    radiusInMeters = 7000000;
    radiusInKm = this.radiusInMeters / 1000;

    // User marker Icon
    icon = {
        url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/96290-200.png',
        scaledSize: {
            width: 50,
            height: 50
        }
    }

    cooperative : string;

    //----- Search String for Search Filter Pipe ------------------------
    searchText;
    searchServiceText;

    services = [];  // This array will have all the services that are returned against a company location
    company_locations = [];
    current_company_location;

    // For giving background color to selected location
    selectedIndex;
    selectedParentIndex;

    total_price = 0 ;

    


    staff_book_date;
    staff_book_time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    employee_Id = 0;
    saveStaff;
    proceedService;

    user_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;

    // This has all the cartItems and its services in it
    cartServices = [];
    locationEmployees = [];

    // CartItems Card Index
    agreedCartItemIndex;

    //permissions array for services checkboxes which will be disabled if already present in cartItems' as services (smj mujay bhi nai aae but theek hai :p)
    permissions = [];

    // Permissions array for search by service functionality
    permissions2 =[];

    preloader: boolean = true;  // While showing Companies & Locations this loader will trigger until fetched
    preloaderServices: boolean = true; // While showing services this loader will trigger until fetched

    preloaderFetchingCartItems: boolean = true; // While fetching crat Items this loader will trigger until fetched

    preloaderNoCartItemsFound: boolean = true;

    public company_and_locations = [];



    selectedServices;

    // List of Markers for companies' locations
    markers: Array<{ latitude: number, longitude: number, name: string }> = [
        { 'latitude': 33.6844, 'longitude': 73.0479, 'name': 'Pre-Filled' },
    ];

    // Temporary Array to store selected services' ids that are to be added in cart
    servicesTobeAddedInCart = [];
    isDisabled = true;


    // This check if Cart Item is selected or not (terms and condition checkbox)
    isProceedFirstEnabled = true;

    // This check if service in cart is checked or not
    isServiceInCartChecked = false;

    // Payment Details of Place Order
    payment: Array<{}> = [
        {
            "card_name": "card_number",
            "card_expiry_month": 4,
            "card_expiry_year": 2018,
            "card_cvv": 123,
            "card_holder_name": "card_holder_name"
        }
    ]

    //  Services of Place Order
    servicesPlaceOrder: Array<{}> = [

        /* SAMPLE CODE */
        // {
        //     "service_id":"test_Id",
        //     "service_price":"45",
        // }
    ]

    customer_Id;
    chargeApiUrl;
    application_fee_percent;
    application_fee_amount;
    customer_EmailAddress;

    // Company Id of a Company for which order is being placed
    cartPlaceOrderCompanyId;

    // Selected Company Id of service being ordered
    selectedCompany_id;

    //    Format of ConfirmationStepCardInfo

    confirmationStepCardInfo = {
        company_name: '',
        discount: '',
        service: [
            {
                // 'service_id': '',
                // 'service_price': ''
                category_id: '',
                company_id: "",
                company_location_id: '',
                created_at: '',
                currency: '',
                details: '',
                frequency: '',
                id: '',
                latitude: null,
                location: null,
                longitude: null,
                name: '',
                price: '',
                publish: '',
                rand_id: '',
                status: '',
                subcategory_id: '',
                updated_at: '',
                video_links: ''
            }



        ],
        sub_total_price: '',
        tax: '',
        total_price: ''
    };

    // The Complete Data of Place Order
    data: Array<{}> = [
        {
            "company_id": this.cartPlaceOrderCompanyId,
            "customer_id": this.customer_Id,
            "total_price": this.total_price + this.total_price*(parseInt(this.application_fee_percent)/100),
            "services": this.servicesPlaceOrder,
            "employee_id": this.employee_Id,
            "application_fee_price": this.application_fee_price,
            "application_fee_percentage": this.application_fee_percentage,
            "date": this.staff_book_date,
            "time": this.staff_book_time,
            "company_schedule": "company_timings",
            "payment": this.payment
        }
    ]

    // Filtered locations based on user radius selection from front end
    filteredMarkers = [];


    // Search By Company and Service variable
    searchByCompanyView:boolean = true;

    // PAYMENT STRIPE VARIABLES

    @ViewChild('cardInfo') cardInfo: ElementRef;

    card: any;
    cardHandler = this.onChange.bind(this);
    error: string;

   @ViewChild(CartComponent) private cardLoad: CartComponent;
   //public getCartItemInputVar : any;


    /* ------------------ AWS CODE END ---------------------- */

    ngOnInit() {

        this.runOnChildNotify(Event);

        this.getUserLocation();  // Return User Location Lat lng
        this.getCustomerStats();
        // this.getCompanyServices();
        // this.getCompanies();
        // this.FetchCompanyLocationServicesNew();
        this.application_fee_percentage = JSON.parse(localStorage.getItem('currentUser')).success.application_fee;
             
        // console.log(this.application_fee_percentage);
        // console.log(this.total_price);

        this.customer_Id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        this.customer_EmailAddress = JSON.parse(localStorage.getItem('currentUser')).success.email;
        this.application_fee_percent = parseInt(JSON.parse(localStorage.getItem('currentUser')).success.application_fee);
        console.log("application %age => ",typeof (this.application_fee_percent));

        console.log(this.customer_Id);


       // this.getServicesToCart();
        console.log("cart Items => ", this.cartServices);

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

        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);

        //this.card.addEventListener('change', this.cardHandler);

    }

    ngOnDestroy() {

        // In the OnDestroy we clean up by removing the change event listener and destroying the card element.
        //this.card.removeEventListener('change', this.cardHandler);
        //this.card.destroy();
    }

    //------------------- FOR STRIPE PAYMENT-------------------

    /* We make use of ChangeDetectorRef to manually instruct Angular to run a
        change detection cycle in the onChange method.
     */
    onChange({ error }) {
        if (error) {
            this.error = error.message;
        } else {
            this.error = null;
        }
        this.cd.detectChanges();
    }

    /* Our form submission method, onSubmit, is an async function that awaits
        for Stripe’s createToken promise to resolve.
     */
    // here is things defined globally...
    stripe_token_id;
    application_fee_inCents;
    transaction_id_for_Transaction;
    order_id_for_Transaction;
    behalf_account; 
    card_id; 
    application_fee;
    async onSubmitPayment(form: NgForm) {
        console.log("Cart Hit");
        const { token, error } = await stripe.createToken(this.card, {
            email: this.customer_EmailAddress,
            name: "Jim Carrie"
        });
        console.log("promise returned");
        if (error) {
           
            console.log('Something is wrong:', error);
        } else {


            
             // -----------------------------------first api for stripe------------------------------------------------------
            console.log(this.customer_EmailAddress);
            console.log('Success!', token);
            this.stripe_token_id = token.id;
            console.log("stripe token id",this.stripe_token_id);
            // ...send the token to the your backend to process the charge
           
            

            let status_set_id = 1;
            let company_id = this.selectedCompany_id;
            // if(this.current_company_location.company_name.id != undefined) {
            //     company_id = this.current_company_location.company_name.id;
            //     console.log("Company ID is", company_id);
            // }



            //price calculation system
            this.application_fee_price = this.total_price*(parseInt(this.application_fee_percentage)/100);
            console.log(this.application_fee_price); 

            this.application_fee_inCents = this.application_fee_price*100;
            console.log("InCents"+this.application_fee_inCents);
            console.log("total amount bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb => ", this.application_fee_price);
         
             // ---------------------------------------second api for carge------------------------------------------------------
             this._demoService.createChargesApi(

                // "application_fee": application_fee,
                // "amount" : amount,
                // "company_id" : company_id

                this.application_fee_inCents, 
                this.total_price + this.application_fee_price,
                company_id,
                this.stripe_token_id
                
                ).subscribe(
                (res: any) => {
                    console.log("here is the charge api hitted", res);
                    this.transaction_id_for_Transaction = res.id;
                    this.behalf_account = res.on_behalf_of;
                    console.log("on behalf" +  this.behalf_account);
                    this.application_fee = res.application_fee;
                    console.log("Application fee" + this.application_fee);
                    this.card_id = res.source.id;
                    console.log("card id" +  this.card_id);
                    console.log("here is the transaction id"+this.transaction_id_for_Transaction);

                    
             // ---------------------------------------third api for place order-------------------------------------------------

            this._demoService.placeCartOrder(status_set_id, company_id).subscribe(
                (response: any) => { },
                (err) => { console.error(err) },
                () => {
                    console.log("Status 01 HAS BEEN Posted!");
                    // New Place Order Api Called Here
                    this.orderNowCheck = true;
                    console.log(this.transaction_id_for_Transaction);
                    this.PlaceOrderInformation();
 
            

                }
            )
    
                },
                (err) => { console.error(err); },
                () => { console.log("Charge Api Placed Successfully from new API"); 
                

                
            }
                )




           
        }
       
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


                    // Get Companies, Locations first then gets services when location_rand id is sent
                    this.getCompaniesNew();
                    console.log('user_lat => ' + this.latitude + "| user_lng => " + this.longitude);

                    // Get Companies, Locations and Services
                    this.getAllCompanyServices();

                    this.updateMarkers(event);

                }
            });
        } else {
            // no can do
            console.log("Your Browser Doesn't Support Location!");
        }
    }

    updateMarkers(event) {

        // console.log(typeof(parseInt(event.target.value)));

        this.radiusInKm = parseInt(event.target.value) / 1000;

        this.savedMarkers = this.markers;

        this.mapsAPILoader.load().then(() => {
            const center = new google.maps.LatLng(this.latitude, this.longitude);
            this.filteredMarkers = this.savedMarkers.filter(m => {
                const markerLoc = new google.maps.LatLng(m.latitude, m.longitude);
                const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(markerLoc, center) / 1000;

                if (distanceInKm < this.radiusInKm) {
                    return m;
                }
            });
        });

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
                            this.markers.push({ 'latitude': parseFloat(y.lat), 'longitude': parseFloat(y.lng), 'name': y.name })
                             //console.log("Location names are => ",y.name);
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


    infoWindowOpened = null;

    clickedMarker(infoWindow) {

        if( this.infoWindowOpened ===  infoWindow)
            return;

        if(this.infoWindowOpened !== null)
            this.infoWindowOpened.close();

        this.infoWindowOpened = infoWindow;
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
                this.company_and_locations.forEach(x => {
                    x.location.forEach(y => {
                        this.markers.push({ 'latitude': parseFloat(y.lat), 'longitude': parseFloat(y.lng), 'name': y.name })
                    })

                });
                console.log(this.markers);
                console.log(" Company & Locations => ",this.company_and_locations);
                this.preloader = false;


            },
            (err) => { console.error(err) },
            () => { console.log('Data Fetched.') }
        )

    }

    companyLocationServices = [];

    locations_Services = [];

    getAllCompanyServices() {
        this._demoService.getCompanyAndLocationsAndServicesWithLatLng(this.latitude,this.longitude, this.radiusInKm).subscribe(
            (response:any) => {
                this.companyLocationServices = response.data;
                console.log("All Companies, Locations & Services are => ", this.companyLocationServices);

                // this.permissions2 = [];
                // this.services.forEach(x => {
                //     let isExist = false;
                //     cartServices.forEach(y => {
                //         if (y['rand_id'] == x['rand_id']) {
                //             isExist = true;
                //         }
                //         console.log("Y Rand Id => ", y['rand_id']);
                //         console.log("X Rand Id => ", x['rand_id']);
                //     })
                //     this.permissions2.push(isExist);
                // })
                // console.log('Permissions Array has => ', this.permissions2);


            },
            (err) => { console.error(err); },
            () => { console.log('Data Fetched.'); }
        )
    }


    // Search By Company and Service Functions

    searchByCompany(event) {
        this.searchByCompanyView = true;
    }

    searchByService(event) {
        this.searchByCompanyView = false;
        this.showServices = false;
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
                this.cartCheckBoxComparison();
            }
        );
    }


     // showPrice(price) {
     //        console.log("selected Price is=>", + typeof price);
     //        return (parseFloat(price) + parseFloat((price*(this.application_fee_percent/100))));
     //
     // }

     getCartCountOnBtn(){
        this.getServicesToCart();
    }

    addServicesToCart() {
        let company_id = this.current_company_location.company_name.id;

        // rand Ids of services will be added in temporary array
        let servicesIds = [];
        this.servicesTobeAddedInCart.forEach(service => {
            servicesIds.push(service['rand_id']);
        });
        console.log('Customer =>' + this.customer_Id + ' Services ids => ' + servicesIds + ' Company=> ' + company_id);
        this._demoService.postSevicestoCart(this.customer_Id, servicesIds, company_id)
            .subscribe(
            (response: any) => {
                this.getCustomerStats();
                this.toastrService.showSuccessMessages("Item Added to Cart Successfully !");
            },
            (err) => { console.error(err) },
            () => { console.log("Status 200 Posted!") 

            setTimeout(() => {
                this.showServices = false;
              }, 1000);

              this.getServicesToCart();
             
           // Return User Location Lat lng
            
        
        }
            )
    }

    addServicesToCart2() {

        let servicesIds = [];
        this.servicesTobeAddedInCart.forEach(locationSelectedService => {
            servicesIds.push(locationSelectedService['rand_id']);
        });

        this._demoService.postSevicestoCart(this.customer_Id, servicesIds, this.companyIdFromSelectedService)
            .subscribe(
                (response: any) => {
                    this.getCustomerStats();
                    this.toastrService.showSuccessMessages("Item Added to Cart Successfully !");
                   
                },
                (err) => { console.error(err) },
                () => { console.log("Status 200 Posted!") }
            )
    }

    getServicesToCart() {
        this.isProceedFirstEnabled = true;
        this.agreedCartItemIndex = undefined;
        this._demoService.getServicesToCart(this.user_id).subscribe(
            (response: any) => {
                this.cartServices = response.data; console.log("this is cart Items response =>", this.cartServices);
                
                console.log(this.total_price);

                /*  This Code will push services' rand_id into permissions2 array
                    and later will be used as a check for disabling services
                    checkboxes in SEARCH BY SERVICE section
                */

                // //this.cardLoad.nativeElement.getCartItem();
                // console.log("here is cart load...........",this.cardLoad);
                this.cardLoad.getCartItem();
               // this.getCartItemInputVar = this.getServicesToCart();
                this.permissions2 = [];
                this.cartServices.forEach(item => {
                    item.service.forEach(service => {
                        this.permissions2.push(service.rand_id);
                    });
                });

                console.log("permissions2 => ",this.permissions2);
                this.preloaderFetchingCartItems = false;
            },
            err => {
                console.error(err);
                this.preloaderNoCartItemsFound = false;
            },
            () => { console.log("Cart Fetching is working")
            
        
        }

        )
    }

    public getCountOnButton;

    recieveDataFromChild(Event)
    {
        this.getCountOnButton = this.getCustomerStats();
    }

    //variable for dashboard stats
    dashboardstat;
    dashboardcustomer;
    getCustomerStats() {
        this._demoService.getCustomerStats().subscribe(
            (data: any) => { 
                this.dashboardstat = data.data; 
                this.dashboardcustomer = this.dashboardstat.customer;

                console.log("here is dashboard response --------------",this.dashboardstat)
                // console.log("here is dashboard response --------------",this.dashboardcustomer)
             },
            err => { console.error(err) },
            () => {  }

        )
    }

    getStaffFromLocation() {
        let location_randId = this.current_company_location.location[this.selectedIndex].rand_id;
        this._demoService.getStaffFromLocation(location_randId).subscribe(
            (response: any) => { this.locationEmployees = response.data; console.log(this.locationEmployees = response.data) },
            err => { console.error(err) },
            () => { console.log("Get staff from location API Is running. Staff for the location is: .", this.locationEmployees) }

        )
    }


    proceedCartServices(cartServicesInfo, index, serviceInfoIndex) {
        // weekends are disabled


        // this.companyNameOnConfirmationStep = cartCompanyName;
        this.confirmationStepCardInfo = cartServicesInfo;
        console.log("this is confirmationStepCardInfo => ", this.confirmationStepCardInfo);
        console.log('Hellow New => ', this.current_company_location);
        let company_id;
        if(this.current_company_location) {
            console.log("inside If");
             company_id = this.current_company_location.company_name.id;
        }

        console.log("company_id is => ", company_id);
        console.log("selectedCompany_id => ", this.selectedCompany_id);
        this.cartPlaceOrderCompanyId = this.selectedCompany_id;
        console.log('this is company_id for which item was added to cart ' + company_id + ' and this is the company id for which items in cart have been proceeded against ' + this.selectedCompany_id);
        let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        // console.log(' total price is => ' + this.confirmationStepCardInfo.service[serviceInfoIndex].price +  ' and index => ' + index);
        // this.total_price = parseInt(cartServicesInfo[serviceInfoIndex].price);
        console.log("Total Price is=> ", this.total_price);

        // Fetches The company Schedule
        this.fetchCompanySchedule();

        this._demoService.proceedCartServices(this.total_price + this.total_price*(this.application_fee_percent/100), this.selectedCompany_id, customer_id)
            .subscribe(
            (response: any) => {
                this.proceedService = response.data;
                console.log("Proceed Cart Service: ", this.proceedService);
            },
            (err) => { console.error(err) },
            () => { console.log("Proceed Cart Services have been posted", ) }
            )
    }

    //Sample Days Array Against which schedule days will be compared
    disabledDaysArray = [];

    dateDisabled;

    locationSchedule: string;
    startingScheduleHour: number;
    endingScheduleHour: number;


    // Get Schedule for the selected Company
    fetchCompanySchedule() {
        console.log('Company ID is=>' + this.selectedCompany_id);
        console.log('Location Rand ID is=>' + this.selectedCompanyLocationId);
        this._demoService.getCompanySchedule(this.selectedCompany_id, this.selectedCompanyLocationId).subscribe(
            (response: any) => {
                console.log("Company Schedule is=> ", response.data);
                console.log("Scheduled days is=> ", response.data['0'].company_schedule.day);
                if (response.data['0'].company_schedule.day.indexOf("Mon") == -1) {
                    this.disabledDaysArray.push(1);
                }
                if (response.data['0'].company_schedule.day.indexOf("Tue") == -1) {
                    this.disabledDaysArray.push(2);
                }
                if (response.data['0'].company_schedule.day.indexOf("Wed") == -1) {
                    this.disabledDaysArray.push(3);
                }
                if (response.data['0'].company_schedule.day.indexOf("Thu") == -1) {
                    this.disabledDaysArray.push(4);
                }
                if (response.data['0'].company_schedule.day.indexOf("Fri") == -1) {
                    this.disabledDaysArray.push(5);
                }
                if (response.data['0'].company_schedule.day.indexOf("Sat") == -1) {
                    this.disabledDaysArray.push(6);
                }
                if (response.data['0'].company_schedule.day.indexOf("Sun") == -1) {
                    this.disabledDaysArray.push(7);
                }

                console.log("Disabled days are=> ", this.disabledDaysArray);
                this.locationSchedule = response.data['0'].company_schedule.from + ' - ' + response.data['0'].company_schedule.to;
                this.startingScheduleHour = parseInt(response.data['0'].company_schedule.from.split(':')['0']);
                this.endingScheduleHour = parseInt(response.data['0'].company_schedule.to.split(':')['0']);
                console.log(this.locationSchedule);
                //----------- THIS LINE DISABLES THE DAYS THAT ARE NOT RETURNED IN LOCATION SCHEDULE! ----------
                this.dateDisabled = (date: NgbDate, current: { month: number }) => this.disabledDaysArray.indexOf(this.calendar.getWeekday(date)) != -1;

            },
            (err) => { console.error(err) },
            () => { console.log("Schedule Fetched") }
        )
    }


    enableScheduleProceedBtn = false;
    isMessageDisplayed = false;
    availableSlotMessage = false;

    checkTimeAvailability() {

        console.log("Data Passed=> " + 'loc_ID ' + this.selectedCompanyLocationId + 'Comp_ID ' + this.selectedCompany_id + 'Time ' + this.staff_book_time + 'Date ' + this.staff_book_date);
        this._demoService.checkAvailableTime(this.selectedCompanyLocationId, this.selectedCompany_id, this.staff_book_time, this.staff_book_date).subscribe(
            (res: any) => {
                console.log(" Available Api Response is => ", res)
                if (res.success == '1') {
                    this.enableScheduleProceedBtn = true;
                    this.isMessageDisplayed = true;
                    this.availableSlotMessage = true;
                    this.hiddenScheduleProcceed = true;
                }
                else {
                    this.enableScheduleProceedBtn = false;
                    this.isMessageDisplayed = true;
                    this.availableSlotMessage = false;
                }
            },
            (err) => { console.error(err) },
            () => { }
        )
    }


    clearPlacedOrder() {
        console.log(this.servicesPlaceOrder, this.data, this.payment);
        this.activePaymentTab = false;
        this.isMessageDisplayed = false;
        this.orderNowCheck = false;

    }


    /* Cart First Screen Variables */
    // selectedLocationServicePrice = 0;   // AKA  Sub Total Price
    // discountAmount = 0;
    // taxAmount = 0;
    // totalAmount = 0;

    selectedCompanyName;
    selectedServiceName;
    selectedCompanyLocationId;
    cartItem_id;

    // Get selected location service and its information on radio button selection

    servicesInCartRadiosFirstScreen(company_name, info, event, cart_id, index, parentIndex) {

        //
        this.cartItem_id = cart_id;
        // Check for looking what is selected service parent's index
        this.selectedServiceParentIndex = parentIndex;

        this.isServiceInCartChecked = event.target.checked;




        this.isProceedFirstEnabled = false;
        this.servicesPlaceOrder = [];
        this.servicesPlaceOrder.push({
            "service_id": info.rand_id,
            "service_price": info.price
        }
        );

        this.total_price = parseInt(info.price);
        console.log('price is => ', this.total_price);
        // this.discountAmount = (this.selectedLocationServicePrice*40)/100;
        // this.taxAmount = (this.selectedLocationServicePrice*10)/100;
        // this.totalAmount = this.selectedLocationServicePrice - this.discountAmount - this.taxAmount;
        console.log('service rand id => ', info.rand_id);
        console.log("company ID => ", info.company_id);

        this.selectedCompanyLocationId = info.company_location_id;
        console.log("company Location ID => ", this.selectedCompanyLocationId);
        this.selectedCompany_id = parseInt(info.company_id);

        this.selectedCompanyName = company_name;
        this.selectedServiceName = info.name;

        // console.log('discount is => ', this.discountAmount);
        // console.log('Tax is => ', this.taxAmount);
        // console.log('Total is => ', this.totalAmount);
        console.log('event is => ', event.target.checked);
        console.log('index is => ', index);
    }

    // OLD CODE
    // changeDateFunc(event) {
    //     this.staff_book_date = event.target.value;
    //     console.log("The date selected is ", this.staff_book_date);
    // }



    timeSlotPicker = { hour: 13, minute: 30 };
    hourStep = 1;
    minuteStep = 15;

    //Disable Time that is not in schedule

    OLDctrl = new FormControl('', (control: FormControl) => {
        const value = control.value;

        if (!value) {
            return null;
        }

        if (value.hour < this.startingScheduleHour) {
            return { tooEarly: true };
        }
        if (value.hour > this.endingScheduleHour) {
            return { tooLate: true };
        }

        return null;
    });

   

    changeTimeFunc(event) {
        this.staff_book_time = event.target.value;
        console.log("The time selected is ", this.staff_book_time);
    }

    getTimeAndDate() {
        this.staff_book_time = this.timeSlotPicker.hour + ':' + this.timeSlotPicker.minute + ':' + '00';
        console.log('time is', this.staff_book_time);
        console.log('Date is', this.staff_book_date);
    }

    changeTimeFunc2(event) {
        console.log(event.target.value);
        console.log(this.timeSlotPicker);
        this.staff_book_time = this.timeSlotPicker.hour + ':' + this.timeSlotPicker.minute + ':' + '00';
        console.log(this.staff_book_time);
    }

    // date: NgbDate = new NgbDate(2018,11,6);
    // dateDisabled = (date: NgbDate, current: {month: number}) => day.date === 13;

    changeDateFunc2(event) {
        console.log(event);
        let selectedDate;
        selectedDate = event.year + '-' + event.month + '-' + event.day;
        console.log("The date selected is ", selectedDate);
        this.staff_book_date = selectedDate;
    }



    /* Code which was used to fetch employee Id now hardcoded to 0 */

    // getEmpId(event){
    //     this.employee_Id = event.target.value;
    //     console.log("EMPLOYEEE ID: ",this.employee_Id)
    // }

    saveStaffSchedule() {
        // let company_id = this.current_company_location.company_name.id;


        console.log("Employe ID: ", this.employee_Id, "Date: ", this.staff_book_date, "Time: ", this.staff_book_time,
            "Company ID: ", this.cartPlaceOrderCompanyId);
        this._demoService.saveStaffSchedule(this.cartPlaceOrderCompanyId, this.employee_Id, this.staff_book_date, this.staff_book_time)
            .subscribe(
            (response: any) => { this.saveStaff = response.data },
            (err) => { console.error(err) },
            () => { console.log("Staff Schedule has been saved: ", this.saveStaff) }
            )
    }


    // placeCartOrder() {
    //     let status_set_id = 1;
    //     let company_id = this.current_company_location.company_name.id;
    //     console.log("Company ID is", company_id);
    //     this._demoService.placeCartOrder(status_set_id, company_id).subscribe(
    //         (response: any) => { },
    //         (err) => { console.error(err) },
    //         () => {
    //             console.log("Status 01 HAS BEEN Posted!");
    //             // New Place Order Api Called Here
    //             this.PlaceOrderInformation();
    //             this.orderNowCheck = true;
    //         }
    //     )

    // }

    placeCartOrder2() {
        // let status_set_id = 1;
        let company_id = this.current_company_location.company_name.id;
        console.log("Company ID is", company_id);
        console.log("total Price new button => ", this.total_price);

        console.log("Confirmation Step Card Info Complete => ", this.confirmationStepCardInfo);


    }

    //--------------------------------- Save Order Information and Place Order -----------------------------------------

    PlaceOrderInformation() {
        // let company_id = this.current_company_location.company_name.id;
        // let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        let company_timings = "Timings";

        console.log("aja Yaar bhai=> ", this.confirmationStepCardInfo);
        /* This code pushes services that are being confirmed in cart in the services array for places order request in Final Data Array */

        // this.confirmationStepCardInfo.service.forEach(x => {
        //     this.servicesPlaceOrder.push( { 'service_id': x.rand_id, 'service_price': x.price})
        // });

       console.log("transaction_id"+this.transaction_id_for_Transaction);
       
        console.log("services in final Card => ", this.servicesPlaceOrder);
         
        
        // console.log (this.total_price = this.confirmationStepCardInfo['total_price']);
        this._demoService.saveOrderInformation(

            this.cartPlaceOrderCompanyId, 
            this.customer_Id, 
            this.total_price, 
            this.servicesPlaceOrder, 
            this.employee_Id,
            this.selectedCompanyLocationId,
            this.application_fee_price,
            this.application_fee_percentage,
            this.staff_book_date, 
            this.staff_book_time, 
            company_timings, 
            this.payment,
            this.cartItem_id,
            this.transaction_id_for_Transaction
            ).subscribe(
            (res: any) => {
                console.log("this will be posted as order => ", res);
                this.order_id_for_Transaction = res.order_id;
                console.log("here is the order id"+this.order_id_for_Transaction);

            },
            (err) => { console.error(err); },
            () => { console.log("Test Order Placed Successfully from new API"); 
            
            
                      // ---------------------------------------fourth api for place order-------------------------------------
                
                      let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
                         let company_id = this.current_company_location.company_name.id;
                      //let company_id = this.selectedCompany_id;
                      this._demoService.createTransaction(
                        customer_id,
                        this.transaction_id_for_Transaction,
                        this.order_id_for_Transaction,                         
                        this.behalf_account, 
                        this.card_id, 
                        this.application_fee,
                        company_id
                        
                        ).subscribe(
                        (res: any) => {
                            console.log("here is the transaction api hitted");
            
                                
                        },
                        (err) => { console.error(err); },
                        () => { console.log(""); }
                        )  
            
        }
            )
    }



    getAllCartData() {
        let company_id = this.current_company_location.company_name.id;
        let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        let price = this.total_price;


    }


    sideInfoPop(value: string, location, index: number, parentIndex: number) {
        if (value == "service") {
            // console.log(this.showServices);
            this.showServices = true;
            // console.log(this.showServices);
            // setTimeout(()=> {
            //     console.log(this.showServices);
            // },2000)
            this.isDisabled = true;
            console.log('isDisabled now must be true => ', this.isDisabled);
            this.selectedIndex = index;
            this.selectedParentIndex = parentIndex;
            console.log(this.current_company_location = location);
            // this.FetchCompanyLocationServices(); OLD METHODE
            this.FetchCompanyLocationServicesNew();

        } else {
            console.log('in else');
            this.showServices = false;
            this.showOrderHistory = false;
            this.showInfo = true;
        }

        console.log('isDisabled now must be true => ', this.isDisabled);
    }

    cartCheckBoxComparison() {
        console.log(this.cartServices);
        let company_id = this.current_company_location.company_name.id;

        // this line returns cart Item based on company Id after comparing company id of cart item against selected company id
        let cartItem = this.cartServices.find(x => x.service[0].company_id == company_id);

        // this line returns services array of company if company Id is matched, otherwise returns empty array
        let cartServices = (cartItem ? cartItem.service : []);
        console.log(" cart Services are=> ", cartServices);
        this.permissions = [];
        this.services.forEach(x => {
            let isExist = false;
            cartServices.forEach(y => {
                if (y['rand_id'] == x['rand_id']) {
                    isExist = true;
                }
                console.log("Y Rand Id => ", y['rand_id']);
                console.log("X Rand Id => ", x['rand_id']);
            })
            this.permissions.push(isExist);
        })
        console.log('Permissions Array has => ', this.permissions);
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


    // Cart Item Index
    termsAndConditonIndex;

    //Cart Items' service index
    selectedServiceParentIndex;


    showProceedButton1(event: Event, index) {

        this.termsAndConditonIndex = index;
        console.log("Terms Index is =>", this.termsAndConditonIndex);

        // this.selectedServiceParentIndex = index;
        console.log("Service Index is =>", this.selectedServiceParentIndex);

        this.isServiceInCartChecked = false;
        if ((<HTMLInputElement>event.target).checked) {
            this.proceedCounter++;
            this.hideTermsModal = false;
            this.agreedCartItemIndex = index;
            // this.confirmation = true;
        } else {
            this.hideTermsModal = true;
            this.agreedCartItemIndex = -1;
            if (this.proceedCounter == 0) {
                return;
            }
            this.proceedCounter--;
        }
    }

    hideTabs(event: Event, index) {
        this.proceedCounter--;
        this.hideTermsModal = true;
        this.confirmation = true;
        this.activeItemTab = true;
        this.agreedCartItemIndex = -1;
        this.hideTermsModal1 = true;
        if (this.proceedCounter == 0) {
            return;
        }
        this.proceedCounter--;
        
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

    servicesCheckboxes(event, index) {
        console.log(event.target.checked);
        console.log(index);
        this.servicesTobeAddedInCart = [];
        if (event.target.checked) {
            this.servicesTobeAddedInCart.push(this.services[index]);
            console.log("Cart to be added in cart details=> ",this.servicesTobeAddedInCart);
        }
        else {
            let indexOfObj = this.servicesTobeAddedInCart.indexOf(this.services[index]);
            this.servicesTobeAddedInCart.splice(indexOfObj, 1);

        }
        if (this.servicesTobeAddedInCart.length > 0) {
            this.isDisabled = false;
        }
        else {
            this.isDisabled = true;
        }
        console.log(this.servicesTobeAddedInCart);
    }

    companyIdFromSelectedService;  // Search By Service's Service company_id
    locationSelectedService = [];

    servicesCheckboxes2(event, index, location_id, services, company_id) {
        console.log("change service Event =>", services[index]);
        this.companyIdFromSelectedService = '';
        this.locationSelectedService = services;
        console.log("location Id=> " + location_id);
        this.servicesTobeAddedInCart = [];
        if (event.target.checked) {
            this.companyIdFromSelectedService = company_id;
            this.servicesTobeAddedInCart.push(this.locationSelectedService[index]);
            console.log("Service to be added in cart details=> ",this.servicesTobeAddedInCart);
        }
        else {
            let indexOfObj = this.servicesTobeAddedInCart.indexOf(this.services[index]);
            this.servicesTobeAddedInCart.splice(indexOfObj, 1);

        }
        console.log(this.servicesTobeAddedInCart);
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

    // Checkboxes in Cart of Services
    // servicesInCartCheckboxes(e, i) {
    //     console.log('Value are as follows => ');
    //     console.log(e.target.checked);
    //     console.log(i);
    // }

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

    scheduleTabShow() {
        this.activeScheduleTab = true;
        this.activeMoreTab = false;
    }

    itemTabShow() {
        this.activeScheduleTab = false;
        this.activeItemTab = true;
        this.isMessageDisplayed = false;
    }
    showConfirmationTab() {
        this.confirmation = false;
    }

    runOnChildNotify(event: any) {    
        this.getCustomerStats();
      }

      
}
