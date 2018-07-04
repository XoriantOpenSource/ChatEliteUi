import { component } from "../../../../decorators/component";
const headerTemplate = require("./main.html");
import { appConfig } from "../../../../configs/appConfig";
import * as ko from "knockout";
import getService from "./../../../../services/getService";
const store = require("store");

/**
 * @class
 * @classdesc Contains logic for displaying the header
 */
@component({
    name: "headerComponent",
    template: headerTemplate
})
export default class headerController {

    private _env = ko.observable(appConfig.env);
    private userDetails = ko.observable(appConfig.user_details);
    private show_theme = ko.observable(false);
    private pfDetails = ko.observable({});
    private showProfileComponent = ko.observable(false);
    private subscriptions: Array<any> = [];

    /**
     * Initializes the header component
     */
    public init() {
        // Initialize materialize dropdown
        $(".dropdown-button").dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: "left", // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
        });

        // initialize all modals
        $(".modal").modal({
            // dismissible: false,
        });

        // Apply theme
        if (localStorage.getItem("theme")) {
            $(".__collab_init").parent().removeClass();
            $(".__collab_init").parent().addClass(localStorage.getItem("theme"));
        }

        // Apply specific theme
        $("._theme").click((e: any) => {
            const win: any = window;
            win.WebuiPopovers.hideAll();
            $(".__collab_init").parent().removeClass();
            $(".__collab_init").parent().addClass(e.target.title);
            localStorage.setItem("theme", e.target.title);
        });

        // listener for displaying profile
        document.body.addEventListener("show-profile", (e: any) => {
            if (e.detail) {
                this.showProfile(e.detail);
            }
        });
    }

    /**
     * ChatElite guide displays information about the features. When a user clicks on 'ChatEliteGuide' link, the guide is displayed.
     */
    public startChatEliteGuide = () => {
        $("body").chardinJs("start");
    }

    /**
     *  Displays home screen when user clicks on home link in the header.
     */
    public showHomeScreen = () => {
        const event = new CustomEvent("show-screen", { detail: "" });
        document.body.dispatchEvent(event);
    }

    /**
     * Displays user's own profile
     * @function showProfile
     * @param data Logged in user's details
     */
    public showProfile = (data?: any) => {
        if (this.showProfileComponent()) {
            this.showProfileComponent(false);
        }
        const user: any = getService.sharedDataServiceInstance().allUsersfromDb.find((val: any) => val.user_id === data.user_id);
        if (user) {
            user.userInfo = data;
            this.pfDetails(user);
            this.showProfileComponent(true);
        } else {
            this.pfDetails(data);
            this.showProfileComponent(true);
        }
    }

    /**
     * The application is available in two modes - expanded view and collapsed view. expandchat() method displays the application in expanded mode.
     */
    public expandChat = () => {
        // store.set("__collab_env", "desktop");
        localStorage.setItem("__collab_env", "desktop");
        location.reload();
    }

    /**
     * Displays the application in collapsed mode
     */
    public collapse = () => {
        $("._infoComponent_c,.nav-wrapper_c").slideToggle(100, () => {
            $("._header_collapse_action_c").text(() => {
                $("._infoComponent_c").is(":visible") ? ($("._header_collapse_action_c").attr("title", "collapse ChatElite"), $("._collapse_title").text("")) : ($("._header_collapse_action_c").attr("title", "expand ChatElite"), $("._collapse_title").text("ChatElite"));
                return $("._infoComponent_c").is(":visible") ? "arrow_drop_down" : "arrow_drop_up";
            });
        });
    }

    // Disposes all subscriptions of the controller socket methods
    public dispose() {
        getService.socketioInstance().unsubscribe(this.subscriptions);
    }

    /**
     * @constructor
     */
    constructor() {
        this.init();
    }
}
