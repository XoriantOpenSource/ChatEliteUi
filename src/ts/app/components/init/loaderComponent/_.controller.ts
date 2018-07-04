import { appConfig } from "../../../../configs/appConfig";
import { component } from "../../../../decorators/component";
import * as ko from "knockout";
const loaderTemplate = require("./main.html");

/**
 * Displays a loading icon
 */
@component({
    name: "loaderComponent",
    template: loaderTemplate
})
export default class loaderController {

    private _env = ko.observable(appConfig.env);

    constructor() { }

}
