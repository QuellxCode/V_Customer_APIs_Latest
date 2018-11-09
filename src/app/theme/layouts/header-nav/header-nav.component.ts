import { Component, OnInit, ViewEncapsulation, AfterViewInit, NgZone } from '@angular/core';
import { Helpers } from '../../../helpers';
import { profileService } from '../../../services/profile.service';
import { RouterEvent, Router, ActivatedRoute } from '@angular/router';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    styleUrls: ["./headerCss.css"],
    encapsulation: ViewEncapsulation.None,
    providers:[profileService]
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

    public CustomerProfile = {
        first_name: '',
        last_name:''
       
    };

    
    constructor( private customerProfileData: profileService, private zone: NgZone, private _router: Router) {

    }
    
    ngOnInit() {
        this.getProfile();
    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }

      // to get profile image of customer
      public customerImageUrl  = 'http://www.sharjeelkhan.ca/vease/vease-app/application-file/img/';


      
    getProfile() {
        this.customerProfileData.getCutomerProfile().subscribe(
            (data: any) => {
                this.CustomerProfile = data.data;
                console.log(data);

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


}
