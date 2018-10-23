import { HttpClientModule } from '@angular/common/http';
import { DemoService } from './services/demo.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WizardLeadForm } from './components/leadFormWizard/leadFormWizard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { AgmCoreModule } from '@agm/core';
import { CalendarModule } from 'angular-calendar';
// import { ServerServices_Services } from ''


@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,
    ],
    imports: [
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        AuthModule,
        HttpClientModule,
        CalendarModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyABAXCmYooxcSc5GajYQIDIGgM9U2n6vyg'
        }),
    ],
    providers: [ScriptLoaderService, DemoService],
    bootstrap: [AppComponent]
})
export class AppModule { }
