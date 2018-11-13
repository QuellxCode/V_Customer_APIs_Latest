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
export class profileService {

    constructor(public http: HttpClient) { }

    getCutomerProfile() {
        let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
        return this.http.get('http://sharjeelkhan.ca/vease/vease-app/api/v1/customer-profile/'+customer_id);
    }
    
    createProfileApi(firstName,lastName,picture, address,email,phoneNo, date_of_birth, companyName,occupation,city, state, postCode, linkedin, facebook, twitter, instagram ) {
        // let obj = {
        //     "first_name": firstName,
        //     "last_name": lastName,
        //     "picture": picture,
        //     "address": address,
        //     "phone": phoneNo,
        //     "date_of_birth": date_of_birth,
        //     "company_name" : companyName,
        //     "occupation" : occupation,
        //     "city": city,
        //     "state": state,
        //     "postcode": postCode,
        //     "linkedin" : linkedin,
        //     "facebook": facebook,
        //     "twitter" : twitter,
        //     "instagram" : instagram
        // }
        
        const c_profile_Info = new FormData();
        c_profile_Info.append('first_name', firstName);
        c_profile_Info.append('last_name', lastName);
        c_profile_Info.append('picture', picture);
        c_profile_Info.append('address', address);
        c_profile_Info.append('email', email);
        c_profile_Info.append('phone', phoneNo);
        c_profile_Info.append('date_of_birth', date_of_birth);
        c_profile_Info.append('company_name', companyName);
        c_profile_Info.append('occupation', occupation);
        c_profile_Info.append('city', city);
        c_profile_Info.append('state', state);
        c_profile_Info.append('postcode', postCode);
        c_profile_Info.append('linkedin', linkedin);
        c_profile_Info.append('facebook', facebook);
        c_profile_Info.append('twitter', twitter);
        c_profile_Info.append('instagram', instagram);

        console.log(c_profile_Info);

            // console.log("You Passed This =>" + JSON.stringify(c_profile_Info));
            let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
            return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/customer-profile/'+customer_id, c_profile_Info);
            }

    passwordApi(oldPass, newPass, confirmPass) {
        let obj = {
            "oldPass": oldPass,
            "newPass": newPass,
            "confirmPass": confirmPass
        }
            console.log("You Passed This =>" + JSON.stringify(obj));
            let customer_id = JSON.parse(localStorage.getItem('currentUser')).success.user_id;
            return this.http.post('http://sharjeelkhan.ca/vease/vease-app/api/v1/customer-profile/'+customer_id, obj, httpOptions);
            }


}
