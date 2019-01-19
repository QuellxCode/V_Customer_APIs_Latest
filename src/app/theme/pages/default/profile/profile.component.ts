import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { DemoService } from "../../../../services/demo.service";
import { NgForm } from "@angular/forms";
import { profileService } from "../../../../services/profile.service";
import { ToastrService } from "../../../../services/toastrService.service";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
    profileSectionHidden: boolean;
    securitySectionHidden: boolean;
    paymentSectionHidden: boolean;
    currencyDDLHidden: boolean;
    selectedFile: File;
    // CustomerProfile;

    public CustomerProfile = {
        first_name: '',
        last_name: '',
        email: '',
        picture: '',
        address: '',
        phone: '',
        date_of_birth: '',
        company_name: '',
        occupation: '',
        city: '',
        state: '',
        postcode: '',
        linkedin: '',
        facebook: '',
        twitter: '',
        instagram: ''

    };

    constructor(private _script: ScriptLoaderService, private demoService: DemoService, private profileService: profileService, 
        private toastrService: ToastrService  ) { }
    ngOnInit() {
        this.profileSectionHidden = false;
        this.securitySectionHidden = true;
        this.paymentSectionHidden = true;
        this.currencyDDLHidden = true;
        this.getProfile();
    }

    ngAfterViewInit() {
        this._script.loadScripts("app-profile", [
            "//www.amcharts.com/lib/3/plugins/tools/polarScatter/polarScatter.min.js",
            "//www.amcharts.com/lib/3/plugins/export/export.min.js",
            "assets/app/js/services.js"
        ]);
    }

    onSelectionCurrency(value: string) {
        if (value == "Digital") {
            this.currencyDDLHidden = true;
        } else {
            this.currencyDDLHidden = false;
        }
    }

    // to get profile image of customer
    public customerImageUrl = 'https://www.sharjeelkhan.ca/vease/vease-app/application-file/img/';

    
    public userEmail = JSON.parse(localStorage.getItem('currentUser')).success.email;

    getProfile() {
        this.profileService.getCutomerProfile().subscribe(
            (data: any) => {
                this.CustomerProfile = data.data;
                console.log(data);

            },
            err => console.error(err),
            () => console.log('Done Fetching Profile Data')

        );
    }

    onFileSelected(event) {
        console.log(event);
        this.selectedFile = <File>event.target.files;
    }


    createProfile(form_data: NgForm) {

        this.profileService.createProfileApi(
            form_data.value.f_name,
            form_data.value.l_name,
            this.selectedFile[0],
            // form_data.value.p_image,
            form_data.value.p_address,
            form_data.value.p_email,
            form_data.value.p_phone,
            form_data.value.p_dob,
            form_data.value.p_companyName,
            form_data.value.p_occupation,
            form_data.value.p_city,

            form_data.value.p_state,
            form_data.value.p_postcode,
            form_data.value.p_linkedin,
            form_data.value.p_facebook,
            form_data.value.p_twitter,
            form_data.value.p_instagram)
            .subscribe(
            (data: Response) => {
                console.log(data);
                this.toastrService.showSuccessMessages("Request Successfully Submitted!");
                this.getProfile();
                console.log(form_data);
            },
            error => {
                console.error("Error saving Profile!");
                this.toastrService.showErrorMessages("Error in Submiting Request. Error: " + error.message + "<br> Try Resubmitting The Form");
            }
            );
    }



    security(form_data: NgForm) {
        console.log(form_data.value.category_name);

        this.profileService.passwordApi(
            form_data.value.oldPassword,
            form_data.value.newPassword,
            form_data.value.confirmPassword)
            .subscribe(
            (data: Response) => {
                console.log(data);

                console.log(form_data);
            },
            error => {
                console.error("Error saving Securtiy info!");

            }
            );
    }





    changingRightTabStatus(value: string) {
        if (value == "profile") {
            this.profileSectionHidden = false;
            this.securitySectionHidden = true;
            this.paymentSectionHidden = true;
        } else if (value == "Security") {
            this.profileSectionHidden = true;
            this.securitySectionHidden = false;
            this.paymentSectionHidden = true;
        } else {
            this.profileSectionHidden = true;
            this.securitySectionHidden = true;
            this.paymentSectionHidden = false;
        }
    }



}
