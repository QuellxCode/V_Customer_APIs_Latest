import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit
} from "@angular/core";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";

@Component({
    selector: "app-index",
    templateUrl: "./index.component.html",
    styleUrls: ["./fullcalendar.bundle.css"],
    encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit, AfterViewInit {
    lat: number = 51.678418;
    lng: number = 7.809007;
    icon = "assets/demo/default/media/img/food.png";

    constructor(private _script: ScriptLoaderService) { }
    ngOnInit() { }
    ngAfterViewInit() {
        this._script.loadScripts("app-index", ["assets/app/js/dashboard.js"]);
    }
}
