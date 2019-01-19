import { Component, OnInit, ViewEncapsulation, AfterViewInit, NgZone } from '@angular/core';
import { Helpers } from '../../../helpers';
import { profileService } from '../../../services/profile.service';
import { RouterEvent, Router, ActivatedRoute } from '@angular/router';
import { DemoService } from '../../../services/demo.service';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    styleUrls: ["./headerCss.css"],
    encapsulation: ViewEncapsulation.None,
    providers: [profileService]
})
export class HeaderNavComponent implements OnInit, AfterViewInit {


    src="1546606077.jpg";

    public CustomerProfile = {
        first_name: "",
        last_name: "",
        picture: ""
    };

    dashboardCompany = {
        companies : "",
        locations : "",
        services : ""
    }

    constructor(private customerProfileData: profileService, private zone: NgZone, private _router: Router, private _demoService:DemoService) {

    }
    

    ngOnInit() {
        this.getProfile();
        this.getCustomerStats();
    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }

    // to get profile image of customer
    public customerImageUrl = 'https://www.sharjeelkhan.ca/vease/vease-app/application-file/img/';


    
    public userEmail = JSON.parse(localStorage.getItem('currentUser')).success.email;

    getProfile() {
        this.customerProfileData.getCutomerProfile().subscribe(
            (data: any) => {
                this.CustomerProfile = data.data;
                console.log(data);
                if(this.CustomerProfile.picture==null)
                {
                    this.customerImageUrl+this.src;
                }

            },
            err => {
                console.error(err)
                // location.reload();
                // this.zone.run(() => this._router.navigateByUrl('./login'))
                // this.zone.run(() => this._router.navigate(['/login']));
                // this._router.navigate(['/login']);
                // return false;

            }



        );
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
                
 
               },
              err => { console.error(err) },
              () => { }
  
          )
      }


}
