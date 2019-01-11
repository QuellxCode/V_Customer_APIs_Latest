import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
// import { HttpClient } from '@angular/common/http';
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {
    public token: '';
    constructor(private http: Http) {
    }

    // Signup URL for signing up to server
    requrl = 'https://www.sharjeelkhan.ca/vease/vease-app/api/v1/register';

    // SignIn URL for signing in to server
    loginurl = 'https://www.sharjeelkhan.ca/vease/vease-app/api/v1/login';


    // loging in function and stroing the returned usertoken to local storage
    login(email: string, password: string) {
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        var body = { email: email, password: password };
        return this.http.post(this.loginurl, body, options)
            .map((response: Response) => {
                //  console.log(response);
                let user = response.json();
                //  console.log('token in login');
                //  console.log(user.success.token);
                localStorage.setItem('token', user.success.token);
                this.token = user.success.token;
                if (user && user.success.token) {
                    this.token = user.success.token;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
        // return this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
        //     .map((response: Response) => {
        //         // login successful if there's a jwt token in the response
        //         let user = response.json();
        //         if (user && user.token) {
        //             // store user details and jwt token in local storage to keep user logged in between page refreshes
        //             localStorage.setItem('currentUser', JSON.stringify(user));
        //         }
        //     });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }


    // signup user
    signupUser(name: string, email: string, pass: string, rpass: string) {
        // console.log(name + ' ' + email + ' ' + pass + ' ' + rpass );
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        var body = { email: email, password: pass, c_password: rpass, name: name };
        return this.http.post(this.requrl, body, options)
            .map(res => res.json());
    }

    // this function is being called in serverServices.services.ts file
    getToken() {
        // console.log('token in local stroge');
        // console.log(localStorage.getItem('token'));
        // login();
        return localStorage.getItem('token');
    }
}
