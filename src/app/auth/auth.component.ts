import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AlertComponent } from './_directives/alert.component';
import { LoginCustom } from './_helpers/login-custom';
import { Helpers } from '../helpers';

@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './templates/login-5.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup',
        { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass',
        { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

    constructor(
        private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.model.remember = true;
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._router.navigate([this.returnUrl]);

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/demo3/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                LoginCustom.init();
            });
    }

    signin() {
        this.loading = true;
        this._authService.login(this.model.email, this.model.password)
            .subscribe(
            (data => {
                // localStorage.setItem('currentUser', JSON.stringify(data));
                // console.log(data);
                this._router.navigate(['/dashboard']);
                Helpers.setLoading(true);
            }
            ),
            (error => {
                console.log(error);
                this.showAlert('alertSignin');
                this._alertService.error(error);
                this.loading = false;
            })
            )
        // console.log(this.model.email + ' ' + this.model.password);
        // this._authService.login(this.model.email, this.model.password).subscribe(
        //     data => {
        //         this._router.navigate([this.returnUrl]);
        //     },
        //     error => {
        //         this.showAlert('alertSignin');
        //         this._alertService.error(error);
        //         this.loading = false;
        //     });
    }

    signup(name, email, pass, rpass) {
        // console.log(name.value, email.value, pass.value, rpass.value);
        // this.loading = true;
        // this._userService.create(this.model).subscribe(
        //     data => {
        //         this.showAlert('alertSignin');
        //         this._alertService.success(
        //             'Thank you. To complete your registration please check your email.',
        //             true);
        //         this.loading = false;
        //         LoginCustom.displaySignInForm();
        //         this.model = {};
        //     },
        //     error => {
        //         this.showAlert('alertSignup');
        //         this._alertService.error(error);
        //         this.loading = false;
        //     });
        this._authService.signupUser(name.value, email.value, pass.value, rpass.value)
            .subscribe(
            response => {
                //   console.log(response);
                this.showAlert('alertSignin');
                this._alertService.success(
                    'Thank you. To complete your registration please check your email.',
                    true);
                this.loading = false;
                LoginCustom.displaySignInForm();
                //   this.model = {};
            },
            error => {
                //   console.log(error);
                this.showAlert('alertSignup');
                this._alertService.error(error);
                this.loading = false;
            }
            );
    }

    forgotPass() {
        this.loading = true;
        this._userService.forgotPassword(this.model.email).subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success(
                    'Cool! Password recovery instruction has been sent to your email.',
                    true);
                this.loading = false;
                LoginCustom.displaySignInForm();
                this.model = {};
            },
            error => {
                this.showAlert('alertForgotPass');
                this._alertService.error(error);
                this.loading = false;
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}
