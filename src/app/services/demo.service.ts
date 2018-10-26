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

    postSevicestoCart(customer_id, services_id, company_id) {
        let obj = {
            "customer_id": customer_id,
            "services_id": [services_id],
            "company_id": company_id

        }
            console.log("Posting Service to Cart done is: ",obj);
         return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/cart', obj, httpOptions);
    }

    getSevicestoCart(user_id) {
         console.log("THE USER ID URL IS http://sharjeelkhan.ca/vease/vease-app/api/v1/cart-items/"+user_id);
         return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/cart-items/' + user_id ,  httpOptions);
    }


    getStaffFromLocation(location_RandId){

        return this.http.get('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/location-staff/'+location_RandId, httpOptions);
    }

    placeCartOrder(status_id_set, company_id){
        let status_object = {
            "status": status_id_set
        }
        console.log("status is: ",status_object);
        console.log("http://www.sharjeelkhan.ca/vease/vease-app/api/v1/place-order/"+company_id);
        return this.http.post('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/place-order/'+company_id, status_object, httpOptions)
    }

    proceedCartServices(price, company_id, customer_id) {
        let  obj = {
            "price": price,
            "company_id": company_id,
            "customer_id": customer_id
        }
            console.log("THIS IS CART OBJECT: ", obj);
         return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/book-items', obj, httpOptions);
    }


   
    saveStaffSchedule(company_id, employee_id, date, time){
        let obj = {
            "employee_id": employee_id,
            "date": date,
            "time": time
        }

        console.log("http://sharjeelkhan.ca/vease/vease-app/api/v1/book-employee/"+company_id);
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/book-employee/'+company_id, obj, httpOptions);

    }

    cartProcessArray(company_id, customer_id, total_price, service_id, service_name, employee_id, date, time, company_timings, payment ){
        let Array_obj = {
            "data": [{
                "company_id": company_id,
                "customer_id": customer_id,
                "total_price": total_price,
                "services":  [{
                 "service_id": service_id,
                 "service_name": service_name,
                }],
                "emoloyee_id": employee_id,
                "date": date,
                "time": time,
                "company_schedule": company_timings,
                "payment": [{
                    "card_name": "card_number",
                    "card_expiry_month": 4,
                    "card_expiry_year": 2018,
                    "card_cvv": 123,
                    "card_holder_name": "card_holder_name"
                }]   
            }]
        }
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/parse', Array_obj, httpOptions);


    }
 

    // bookStaffSchedule(employee_id, date, time) {
    //     let  obj = {
    //         "employee_id": employee_id,
    //         "date": date,
    //         "time": time
    //     }
    //         console.log("THIS IS DETAILED EMPLOYEE BOOKING: ", obj);
    //      return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/book-employee/256', obj, httpOptions);
    // }


    /*ESTIMATED RESPONSE*/
    getCategories() {
        return this.http.get(' http://www.sharjeelkhan.ca/vease/vease-app/api/v1/category', httpOptions);
    }

    getSubCategories(rand_id) {
        return this.http.get('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/subcategory/' + rand_id, httpOptions)
}


    /*Lead/Order page*/
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


  /*  postServiceCart() {
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/cart', {
            "customer_id": "193",
            "services_id": "",
            "company_id": "255"


        }, httpOptions);
    }*/

    // getIndividualServices() {
    //   return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/get-service/', httpOptions)
    // }

}
