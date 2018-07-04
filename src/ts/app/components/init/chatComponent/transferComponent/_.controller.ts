import { appConfig } from "../../../../../configs/appConfig";
import { component } from "../../../../../decorators/component";
import { socketIOConstants } from "../../../../../configs/constants";
import getService from "../../../../../services/getService";
import * as ko from "knockout";
const transferTemplate = require("./main.html");

/**
 * @class
 * @classdesc Contains logic for transferring chat
 */
@component({
    name: "transferComponent",
    template: transferTemplate
})
export default class transferController {

    private _env = ko.observable(appConfig.env);
    private subscriptions: Array<any> = [];
    private res: any = ko.observable({});

    /**
     * @constructor
     * @param params object containing information about the transferred conversation
     */
    constructor(params: any) {
        this.res(params.res());
        this.init();
    }

    public init() {
    }

    /**
     * Disposes all subscriptions of the controller socket methods
     */
    public dispose() {
        getService.socketioInstance().unsubscribe(this.subscriptions);
    }

    // Closes the transfer chat screen
    public close_chat_transfer = () => {
        const event = new CustomEvent("_closeTransferChatComponent", { detail: "" });
        document.body.dispatchEvent(event);
    }
}
