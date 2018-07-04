import { decorators } from "../configs/globalVariables";
import { appConfig } from "../configs/appConfig";
import * as ko from "knockout";
const koAnimate = require("../externals/ko/animate");
const koSwitch = require("../externals/ko/switch");
const koSelectize = require("../externals/ko/selectize");
let browsers = require('../externals/js/browsers');
import getService from "../services/getService";
import proto from "./prototype";
/**
 * Boots up the application
 */
export default class bootUp {
    /**
     * @function init
     * @description Boots the app
     */
    public async init() {
        // inject the bootStrap component here
        const bootStrapElem = decorators.filter(val => val.name === "bootstrap")[0];

        if (bootStrapElem) {

            getService.domManipInstance().createElemTag("init-component", document.body);
            const win: any = window;
            // If mode is not demo mode fetch userdetails from the server
            if (!win.__collab_config.demo_mode) {
                await getService.userServiceInstance().getUserDetails().then(() => {
                }, (err) => {
                    throw new Error("User Details not found:" + err.message);
                });
            } else {
                // show login screen for dev
                await this.login();
            }

            ko.applyBindings();
            $("._initErr").remove();

        } else {
            throw new Error("No bootstrap component found");
        }

    }

    /**
     * @function login
     * @description Shows the login screen
     */
    public async login() {
        return getService.domManipInstance().createElemTag("login-component", document.body);
    }

    constructor() {
        const a = new proto();
        this.init().then(() => {
            getService.notificationServiceInstance();
            getService.loggerInstance().debug("bootup done..");
        });

    }
}
