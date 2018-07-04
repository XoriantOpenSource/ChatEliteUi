import { appConfig } from "../../../configs/appConfig";
const initTemplate = require("./main.html");
import { bootstrap } from "../../../decorators/component";
import * as ko from "knockout";
import getService from "../../../services/getService";
import { onlineStatus } from "../../../configs/enums";

/**
 * @class
 * @classdesc Logic for initializing the app and displaying the content
 */
@bootstrap({
    template: initTemplate
})
export default class initController {

    private _env = ko.observable(appConfig.env);
    private showEngine: KnockoutObservable<boolean> = ko.observable(false);
    private subscriptions: Array<any> = [];
    private allUsersArray = ko.observableArray([]);
    /**
     * Inintializes the components
     */
    public init = () => {
        const win: any = window;
        // display chat screen of a user
        document.body.addEventListener("_showChatComponent", (e: any) => {
            win.WebuiPopovers.hideAll();
            if ($("div#__chatComponent").hasClass("hide")) {
                $("div#__chatComponent").removeClass("hide");
            }
            if (!$("div#__homeScreenComponent").hasClass("hide")) {
                $("div#__homeScreenComponent").addClass("hide");
            }
        });

        // Display home screen
        document.body.addEventListener("show-screen", (e: any) => {
            if ($("div#__infoComponent").hasClass("m2")) {
                $("div#__infoComponent").removeClass("m2").addClass("m3");
                $("._infoComponent").removeClass("m12").addClass("offset-m2").addClass("m10");
            }
            $("div#__homeScreenComponent").removeClass("hide");
            $("div#__chatComponent").addClass("hide");
        });

        document.body.addEventListener("allUsersFromDbEvent", (e: any) => {
            if (e.detail) {
                this.allUsersArray(e.detail);
            }
        });

        this.allUsersArray(getService.sharedDataServiceInstance().allUsersfromDb);
    }

    public showChatEngine = () => {
        this.showEngine(true);
    }

    /**
     *  Disposes all subscriptions of the controller socket methods
     */
    public dispose() {
        getService.socketioInstance().unsubscribe(this.subscriptions);
    }
    /**
     * @constructor
     */
    constructor() {
        document.title = "ChatElite";
        // change status of user to online when user focusses on the window
        window.addEventListener("focus", () => {
            getService.socketioInstance().sendData("changeStatus", { onlineStatus: onlineStatus.online });
            document.title = "ChatElite";
        });

        // change status of user to away when user loses the focus of the window
        window.addEventListener("blur", () => {
            getService.socketioInstance().sendData("changeStatus", { onlineStatus: onlineStatus.away });
        });
        this.init();
    }
}
