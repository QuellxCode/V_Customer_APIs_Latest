import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '@angular/compiler';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
}
@Injectable()
export class DemoService {

    constructor(public http: HttpClient) { }

    getServices() {
        return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/get-service', httpOptions);
    }

    // This gets all the companies list
    getCompanies() {
        return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/companies', httpOptions);
    }

    getCompanyAndTheirLocationsWithLatLng(lat, lng, radius) {
        return this.http.get('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/locations/' + lat + "/" + lng + "/" + radius, httpOptions);
    }

    getCompanyLocationServices(rand_id) {
        return this.http.get('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/location-service/' + rand_id, httpOptions);
    }

    getCompanyServices() {

        return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/company-service/256', httpOptions);
    }



    getCustomerOrders(){
        let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/order-customer/'+customer_id, httpOptions);
    }





    /*
    getCompanyServices() {
          let user_id = JSON.parse(localStorage.getItem('currentUser')).data.user_id;
          console.log(user_id);
          return this._http.get('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/service/'+user_id, httpOptions);
      }
    */


    postServiceCart() {
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/cart', {
            "customer_id": "193",
            "services_id": "",
            "company_id": "255"


        }, httpOptions);
    }

    // getIndividualServices() {
    //   return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/get-service/', httpOptions)
    // }

}
