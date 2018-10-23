import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
// import { ServicesComponent } from './services.component';
import { AuthenticationService } from './../auth/_services/authentication.service';

import 'rxjs/add/operator/map'

@Injectable()
export class ServerServices_Services {


    constructor(private http: Http, private autheticationServices: AuthenticationService) { }

    // post request to server for sending data  URl
    private postURL = 'http://www.sharjeelkhan.ca/vease/vease-app/api/v1/request-bid';

    private getURL = ' http://www.sharjeelkhan.ca/vease/vease-app/api/v1/get-service';



    storeRequests(name, details, category_id, price, duration, contact_no, publish, fileToUpload) {
        // console.log('store called');
        if (fileToUpload !== null) {
            const userToken = this.autheticationServices.getToken();
            console.log(userToken);
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + userToken);
            var options = new RequestOptions({ headers: headers });
            const formData: FormData = new FormData();
            formData.append('fileKey', fileToUpload, fileToUpload.name);
            // console.log(formData.get('fileKey'));
            var body = { name: name, details: details, category_id: category_id, price: price, duration: duration, publish: publish, fileToUpload, contact_no: contact_no };
            // console.log(JSON.stringify(body));
            return this.http.post(this.postURL, body, options)
                .map((response: Response) => console.log(response));
        }
        else {
            const userToken = this.autheticationServices.getToken();
            console.log(userToken);
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + userToken);
            var options = new RequestOptions({ headers: headers });
            // console.log(formData.get('fileKey'));
            var bodyF = { name: name, details: details, category_id: category_id, price: price, duration: duration, publish: publish, contact_no: contact_no };
            // console.log(JSON.stringify(body));
            return this.http.post(this.postURL, bodyF, options)
                .map((response: Response) => console.log(response));
        }
    }


    // Getting services data from server
    getServices() {
        // console.log('get task called');
        const userToken = this.autheticationServices.getToken();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + userToken);
        var options = new RequestOptions({ headers: headers });
        console.log(options);
        return this.http.get(this.getURL, options)
            .map(
            (response: Response) => {
                console.log(response);
                const data = response.json();
                return data;
            }
            );

    }
}

// headers = new HttpHeaders().append('Authorization', this.authToken).append('Content-Type', 'application/json');
// "Authentication": userToken,
// "Content-Type": "application/x-www-form-urlencoded",
// })
