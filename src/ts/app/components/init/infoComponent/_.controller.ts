import { component } from "../../../../decorators/component";
const infoTemplate = require("./main.html");
import { appConfig } from "../../../../configs/appConfig";
import * as ko from "knockout";
import getService from "../../../../services/getService";
import { socketIOConstants } from "../../../../configs/constants";
import notifyService from "./notifyService";

/**
 * Registers usersComponent as a component into knockout
 */
@component({
    name: "infoComponent",
    template: infoTemplate
})
export default class infoController {
    private _env = ko.observable(appConfig.env);
    private _totoalUnreadMessages = ko.observable(0);
    private _totalMissedCalls = ko.observable(0);
    private subscriptions: Array<any> = [];
    private _showGroupsComponent = ko.observable(false);
    private _showUsersComponent = ko.observable(false);
    private _showCallsComponent = ko.observable(false);

    /**
     * Initializes the righmost tabs i.e. the infoComponet
     */
    public init() {
        // Initializes notifications
        notifyService.initializeNotify();
        $("ul.tabs").tabs();

        // Displays count of unread messages for all the conversations atop
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.unread_Chat, (res: any) => {
            let total = 0;
            for (const group of res) {
                total += group.count;
            }
            this._totoalUnreadMessages(total);
            if (this._totoalUnreadMessages() > 0) {
                document.title = "ChatElite (" + this._totoalUnreadMessages() + ")";
            } else {
                document.title = "ChatElite";
            }
        }));

        // Display users component if user has not had any conversations
        document.body.addEventListener("_no-recent-chat", (e: any) => {
            $("ul.tabs").tabs("select_tab", "_usersComponent");
            $("body").chardinJs("start");
        });
    }

    /**
     * Display groups tab on clicking upon it
     */
    public showGroupsComponent = () => {
        this._showGroupsComponent(true);
        return true;
    }

    /**
     * Display users tab on clicking upon it
     */
    public showUsersComponent = () => {
        this._showUsersComponent(true);
        return true;
    }

    public dispose = () => {
        getService.socketioInstance().unsubscribe(this.subscriptions);
    }

    constructor() {
        this.init();
    }
}
