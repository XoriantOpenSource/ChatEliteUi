import { appConfig } from "../../../../configs/appConfig";
import { component } from "../../../../decorators/component";
import getService from "../../../../services/getService";
import * as ko from "knockout";
const homeTemplate = require("./main.html");

/**
 * @class
 * @classdesc Contains logic for displaying home screen
 */
@component({
    name: "homeComponent",
    template: homeTemplate
})
export default class homeController {

    private _env = ko.observable(appConfig.env);
    private userDetails = ko.observable(appConfig.user_details);
    /**
     * Initializes the home component
     */
    public init() {
        // initialize carousal
        $(".carousel.carousel-slider").carousel({
            fullWidth: true
        });
    }

    constructor() {
        this.init();
    }
}
