import { appConfig } from "../../../../../configs/appConfig";
import { component } from "../../../../../decorators/component";
import { socketIOConstants } from "../../../../../configs/constants";
import getService from "../../../../../services/getService";
import * as ko from "knockout";
const profileTemplate = require("./main.html");

/**
 * @class
 * @classdesc Contains logic for displaying profile
 */
@component({
    name: "profileComponent",
    template: profileTemplate
})
export default class profileController {

    private _env = ko.observable(appConfig.env);
    private subscriptions: Array<any> = [];
    private res: any = ko.observable({});
    private current_user: any = {};
    private commonGroupsArray = ko.observableArray([]);

    public init() {
        this.current_user = appConfig.user_details;

        if (this.res().user_id !== this.current_user.user_id) {
            $("._holder").removeClass("m12");
            $("._holder").addClass("m6");
            $("#__key").removeClass("m2");
            $("#__key").addClass("m3");
            $("#__key1").removeClass("m2");
            $("#__key1").addClass("m3");

            getService.socketioInstance().sendData(socketIOConstants.common_Grp, { other_user: this.res().userInfo._id });
            this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.common_Grp, (res: any) => {
                if (res) {
                    const grp_id = res[0]._id;
                    getService.socketioInstance().sendData(socketIOConstants.get_Common_Groups, { _id: grp_id });
                }
            }));

            // Display common groups with the user whose profile is displayed
            this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.get_Common_Groups, (res: any) => {
                this.commonGroupsArray(res);

            }));
        }

    }

    /**
     * When the user clicks on a user, conversation with that user is displayed.
     * @function showP2PChat
     */
    public showP2PChat = () => {

        if (this.res()) {
            getService.socketioInstance().sendData(socketIOConstants.create_Chat_Group, { subject: this.res().user_name, users: [this.current_user, this.res().userInfo] });
            $("#_modal4").modal("close");
        }
    }
    /**
     * Disposes all subscriptions of the controller socket methods
     */
    public dispose() {
        getService.socketioInstance().unsubscribe(this.subscriptions);
    }

    /**
     * @constructor
     * @param params An object containing information about user whose profile is to be displayed
     */
    constructor(params: any) {
        this.res(params.res());
        this.init();
    }
}
