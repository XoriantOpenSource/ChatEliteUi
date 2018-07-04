import { appConfig } from "../../../configs/appConfig";
const errorTemplate = require("./main.html");
import { component } from "../../../decorators/component";
import getService from "../../../services/getService";
import * as ko from "knockout";

/**
 * Registers errorComponent as component into knockout
 */
@component({
    name: "errorComponent",
    template: errorTemplate
})
/**
 * @class
 * @classdesc Consists of logic for displaying error messages
 */
export default class errorController {
    private _env = ko.observable(appConfig.env);
    // private showError: KnockoutObservable<boolean> = ko.observable(false);
    // private messageType: KnockoutObservable<string> = ko.observable("");
    // private messageText: KnockoutObservable<string> = ko.observable("");
    private win: any = window;

    public init() {
        document.body.addEventListener("info", (e: any) => {
            this.win.Materialize.toast(e.detail, 6000, "green");
        });

        /**
         * Displays error on failure
         */
        document.body.addEventListener("error", (e: any) => {
            this.win.Materialize.toast(e.detail, 6000, "red");
        });
    }

    /**
     * @constructor
     */
    constructor() {
        /**
         * Displays information on success
         */
        this.init();
    }
}
