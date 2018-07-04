import { component } from "../../../../decorators/component";
const chatTemplate = require("./main.html");
import { appConfig } from "../../../../configs/appConfig";
import getService from "../../../../services/getService";
import * as ko from "knockout";

/**
 * @class
 * @classdesc Logic for displaying chatComponent
 */
@component({
    name: "chatComponent",
    template: chatTemplate
})
export default class chatController {

    private _env = ko.observable(appConfig.env);
    private group_id = ko.observable(null);
    private showChatComponent = ko.observable(false);
    private transferChatData: any = ko.observable({});
    private showTransferComponent = ko.observable(false);
    private currentUserObj: any = ko.observable({});
    /**
     * @constructor
     */
    constructor() {
        this.init();
    }
    /**
     * Initializes chat component
     */
    public init() {
        this.currentUserObj(appConfig.user_details);
        // Display chat component
        document.body.addEventListener("_showChatComponent", (e: any) => {
            if (this.group_id() !== e.detail) {
                document.getElementById("_infoOverlay").style.display = "block";
                if (this.showTransferComponent()) {
                    this.showTransferComponent(false);

                    if ($("div#__introComponent").hasClass("hide")) {
                        $("div#__introComponent").removeClass("hide");
                    }
                    if ($("div#__chattingComponent").hasClass("hide")) {
                        $("div#__chattingComponent").removeClass("hide");
                    }
                }
                if (this.group_id()) {
                    getService.socketioInstance().leaveGroup(this.group_id());
                }
                this.showChatComponent(false);
                setTimeout(() => {
                    this.group_id(e.detail);

                    $("div#__chattingComponent").addClass("m7");

                    if (this._env() === "collapsed") {
                        $("div#__chatComponent").css("right", "22.3vw");
                    }
                    this.showChatComponent(true);
                }, 0);
            } else {
                const chatWidgStatus = $("._chattingComponent_c").is(":visible") ? true : false;
                if (!chatWidgStatus) {
                    $(".__chatComponent_c").show();
                }
            }
        });

        // display transfer conversation message screen
        document.body.addEventListener("_showTransferChatComponent", (e: any) => {
            this.transferChatData(e.detail);
            this.showTransferComponent(true);
        });

        $(document).off("_closeTransferChatComponent");
        // closes transferred chat screen
        document.body.addEventListener("_closeTransferChatComponent", (e: any) => {
            this.showTransferComponent(false);
        });

    }

    public dispose() { }

}
