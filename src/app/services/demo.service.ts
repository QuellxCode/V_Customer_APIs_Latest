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

    // this api will use to get lead section api

    // getCustomerOrders(){
    //     let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
    //     return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/order-customer/'+customer_id, httpOptions);
    // }





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

    postSevicestoCart(customer_id, services_id, company_id) {
        let obj = {
            "customer_id": customer_id,
            "services_id": services_id,
            "company_id": company_id

        }
        console.log("Posting Service to Cart done is: ", obj);
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/cart', obj, httpOptions);
    }

    postResolutionCenter(company_id, service_id, description, status) {
        let obj = {
            "company_id": company_id,
            "service_id": service_id,
            "description": description,
            "status": status

        }
        console.log("Posting Resolution Center is: ", obj);
        let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/resolution-center/' + customer_id, obj, httpOptions);
    }


    getServicesToCart(user_id) {
        console.log("THE USER ID URL IS http://sharjeelkhan.ca/vease/vease-app/api/v1/cart-items/" + user_id);
        return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/cart-items/' + user_id, httpOptions).map(
            (data: any) => {
                let cart_items = data.data;
                console.log("insideMap", cart_items);
                if (cart_items.length > 0) {
                    cart_items.forEach(
                        cart_item => {
                            //Creates [ total_price, sub_total_price, tax & discount ] key for each cart item
                            cart_item['total_price'] = 0;
                            cart_item['sub_total_price'] = 0;
                            cart_item['tax'] = 10;
                            cart_item['discount'] = 40;

                            /* iterates over each service in services array and
                                 calculates prices of all the services and stores it in
                                 cart_item[total_price]'s key as its value
                            */

                            /* ----------------------- I am sure they will come back to this logic --------------------- */
                            // cart_item.service.forEach(
                            //     item_service => {
                            //        cart_item['sub_total_price'] += parseFloat(item_service.price);
                            //     }
                            // )
                            /*------------------------------------ END----------------------------------- */

                            cart_item.service.forEach(
                                item_service => {
                                    item_service['price'] = parseFloat(item_service.price);
                                }
                            )

                            cart_item['discount'] = (cart_item['sub_total_price'] * cart_item['discount']) / 100;                 // Calculates Discount
                            cart_item['tax'] = (cart_item['sub_total_price'] * cart_item['tax']) / 100;                           // Calculates Tax
                            cart_item['total_price'] = cart_item['sub_total_price'] - cart_item['discount'] - cart_item['tax']; // Calculates Total Price
                        }
                    )
                }
                return data;
            }
        );
    }

    getCompanySchedule(companyID, locationRandID) {
        let obj = {
            "location_id": locationRandID
        };
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/company-shift/' + companyID, obj, httpOptions);
    }

    checkAvailableTime(location_id, company_id, time, date) {
        let obj = {
            "location_id": location_id,
            "company_id": company_id,
            "time": time,
            "date": date
        };
        console.log(obj);
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/shift/' + company_id, obj, httpOptions);
    }


    getStaffFromLocation(location_RandId) {

        return this.http.get('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/location-staff/' + location_RandId, httpOptions);
    }

    placeCartOrder(status_id_set, company_id) {
        let status_object = {
            "status": status_id_set
        }
        console.log("status is: ", status_object);
        console.log("http://www.sharjeelkhan.ca/vease/vease-app/api/v1/place-order/" + company_id);
        return this.http.post('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/place-order/' + company_id, status_object, httpOptions)
    }

    proceedCartServices(price, company_id, customer_id) {
        let obj = {
            "price": price,
            "company_id": company_id,
            "customer_id": customer_id
        }
        console.log("THIS IS CART OBJECT: ", obj);
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/book-items', obj, httpOptions);
    }



    saveStaffSchedule(company_id, employee_id, date, time) {
        let obj = {
            "employee_id": employee_id,
            "date": date,
            "time": time
        }

        console.log("http://sharjeelkhan.ca/vease/vease-app/api/v1/book-employee/" + company_id);
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/book-employee/' + company_id, obj, httpOptions);

    }


    saveOrderInformation(company_id: number, customer_id: number, total_price, servicesPlaceOrder,
        employee_id, date: string, time: string, company_timings: string, payment) {
        let array_obj = {
            "data": [{
                "company_id": company_id,
                "customer_id": customer_id,
                "total_price": total_price,
                "services": servicesPlaceOrder,
                "employee_id": employee_id,
                "date": date,
                "time": time,
                "company_schedule": company_timings,
                "payment": payment
            }]
        }
        console.log("You Passed This =>" + JSON.stringify(array_obj));
        return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/parse', array_obj, httpOptions);
    }


    // this api will use to get lead section api

    getCustomerOrders() {
        let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/order-customer/' + customer_id, httpOptions);
    }

    /*ESTIMATED RESPONSE*/
    getCategories() {
        return this.http.get(' http://www.sharjeelkhan.ca/vease/vease-app/api/v1/category', httpOptions);
    }

    getSubCategories(rand_id) {
        return this.http.get('http://www.sharjeelkhan.ca/vease/vease-app/api/v1/subcategory/' + rand_id, httpOptions)
    }


    // getIndividualServices() {
    //   return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/get-service/', httpOptions)
    // }

}
