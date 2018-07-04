import { appConfig } from "../../../../../configs/appConfig";
import { component } from "../../../../../decorators/component";
import { socketIOConstants } from "../../../../../configs/constants";
import getService from "../../../../../services/getService";
import * as ko from "knockout";
import { onlineStatus, notificationType } from "../../../../../configs/enums";
const usersTemplate = require("./main.html");

/**
 * @class
 * @classdesc Contains logic for activities related to the userscomponent
 */
@component({
    name: "usersComponent",
    template: usersTemplate
})
export default class usersController {

    private _env = ko.observable(appConfig.env);
    private tickerArray: KnockoutObservableArray<collab.component.ITicker> = ko.observableArray([]);
    private tickerObj: any = ko.observable({});
    private tickerText: any = ko.observable({});
    private showLoader: KnockoutObservable<boolean> = ko.observable(false);
    private showTicker: KnockoutObservable<boolean> = ko.observable(false);
    private current_user = ko.observable("");
    private current_user_obj: any = ko.observable({});
    private allUsersArray = ko.observableArray([]);
    private allUsers = ko.observableArray([]);
    private Query = ko.observable("");
    private inviteEmail = ko.observable("");
    private subscriptions: Array<any> = [];
    private showTickerList = ko.observable(true);
    private showAddUser = ko.observable(false);
    private showUsersLists = ko.observable(false);
    private selectedIndex = ko.observable(0);

    /**
     * Initializes the user's tab
     */
    public init = () => {
        // To display loader
        this.showLoader(true);
        if (this._env() === "desktop") {
            if ($("#__infoComponent").hasClass("m3")) {
                $("._find_users").css("width", "20vw");
            } else {
                $("._find_users").css("width", "16vw");
            }
        }
        this.current_user_obj(appConfig.user_details);
        this.current_user = appConfig.user_details.user_name;
        if (getService.sharedDataServiceInstance().allUsersfromDb) {
            // all users from db
            this.allUsers(getService.sharedDataServiceInstance().allUsersfromDb);
        }

        document.body.addEventListener("allUserEvent", (e: any) => {
            if (e.detail) {
                this.allUsers(e.detail);
            }
        });

        // Users added in your list
        getService.socketioInstance().getData(socketIOConstants.ticker_all_Users).then((res: any) => {
            this.allUsersArray(res);
            this.showLoader(false);
        });
        // Notify user is online
        getService.socketioInstance().sendData(socketIOConstants.ticker, { online_status: onlineStatus.online });

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.ticker, (res: any) => {
            let flag: boolean;
            if (this.current_user_obj().isInviteUser) {
                if (this.current_user_obj().invitedUsers.findIndex((val: any) => { return val === res.user._id; }) > -1) {
                    flag = true;
                } else {
                    flag = false;
                }
            } else {
                flag = true;
            }
            if (flag) {
                const index = this.allUsersArray().findIndex((val: any) => val._id === res.user._id);
                if (index > -1) {
                    this.allUsersArray.splice(index, 1);
                    this.allUsersArray.push(res.user);
                    this.allUsersArray.sort((a: any, b: any) => {
                        return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
                    });
                }
                this.tickerObj(res);
                if (!this.showTicker()) {
                    this.tickerText(this.tickerObj());
                    if (!res.changeStatus && this.tickerObj().user.online_status === onlineStatus.online) {
                        getService.notificationServiceInstance().notify(`${this.tickerObj().user.user_name} is online.`, notificationType.online);
                    }
                    this.showTicker(true);
                    setTimeout(() => {
                        this.showTicker(false);
                    }, 4000);
                }
            }
        }));

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.add_user_in_ticker_list, (res: any) => {
            const index = this.allUsersArray().findIndex((val: any) => val._id === res._id);
            if (index === -1) {
                this.allUsersArray.push(res);
                this.allUsersArray.sort((a: any, b: any) => {
                    return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
                });
                this.Query("");
                getService.errorServiceInstance().throwInfo("User " + res.user_name + " added successfuly in your users list. From now on you will receive notifications of this user.");
            }
        }));
        // Displays users to add to your list
        $("#_userSearch,._userSearch_c").focusin(() => {
            this.showUsersLists(true);
        }).focusout(() => {
            $("body").click((evt) => {
                // For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
                if ($(evt.target).closest("#_find-users").length) {
                    $("#_userSearch").focus();
                    return;
                }
                // Do processing of click event here for every element except with id menu_content
                if (evt.target.id !== "_userSearch") {
                    this.showUsersLists(false);
                }
            });
        });
        // Removes a user from your own list of users
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.removeUser, (res: any) => {
            const index = this.allUsersArray().findIndex((val: any) => val._id === res._id);
            const win: any = window;
            if (index > -1) {
                this.allUsersArray.splice(index, 1);
                if (res.removed_by === this.current_user_obj()._id) {
                    getService.errorServiceInstance().throwInfo("User " + res.user_name + " removed successfuly.");
                    win.WebuiPopovers.hideAll();
                }
            }
        }));
        // On clicking on a username,it displays chat screen of that user
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.show_Existing_Chat, (res: any) => {
            setTimeout(() => {
                const index = this.allUsersArray().map((el) => {
                    return el._id;
                }).indexOf(res._id);
                this.selectedIndex(index);
            });
        }));

    }

    /**
     * When a user clicks on a user, it sets the index of the clicked upon element from the list as selected index, denoting the particular element is selected.
     * @function onIndexSelected
     * @param index Index of user in the complete list of users
     */
    public onIndexSelected = (index: any) => {
        this.selectedIndex(0);
    }

    /**
     * An individual user has his own list of users. The method searches for particular user from the list.
     * @function searchUsersResults
     * @returns Returns the searched user name
     */
    public searchUsersResults = ko.computed(() => {
        const q = this.Query().toLowerCase();
        return this.allUsers().filter((i: any) => {
            if (i.user_name) {
                return i.user_name.toLowerCase().indexOf(q) >= 0;
            } else {
                return false;
            }
        });
    });

    public changeIcon = () => {
        this.Query("");
    }
    /**
     * Focusses on the search box
     */
    public focusOnSearch = () => {
        document.getElementById("_userSearch").focus();
    }

    /**
     * Creates a conversation group with that particular user if not present, otherwise opens up the existing conversation.
     * @function showp2pchat
     * @param user User details of the one added into your list
     */
    public showp2pchat = (user: any) => {
        const chatUsers = ko.observableArray([]);
        chatUsers().push(user);
        chatUsers().push(this.current_user_obj());
        getService.socketioInstance().sendData(socketIOConstants.create_Chat_Group, { subject: user.user_name, users: chatUsers() });
        this.Query("");
    }
    /**
     * An individual user has his own list of users. The method allows you to remove a particular user from your list.
     * @function removeUser
     * @param Details of the user to be removed
     */
    public removeUser = (user: any) => {
        const user_removed = { user_name: user.user_name, _id: user._id };
        getService.socketioInstance().sendData(socketIOConstants.removeUser, { user_to_remove: user_removed });
        this.closePopover();

    }
    /**
     * Logs out a particular user
     * @function logout
     */
    public logout = () => {
        getService.userServiceInstance().logout();
    }

    /**
     * An individual user has his own list of users. The method allows to add a user to your list of users.
     * @function addUserInTickerList
     * @param Details of user to be added into the list
     */
    public addUserInTickerList = (data: any) => {
        if (data) {
            getService.socketioInstance().sendData(socketIOConstants.add_user_in_ticker_list, { secondUser: data });
        } else {
            getService.errorServiceInstance().throwError("Select at least one user");
        }
    }
    /**
     * An individual user has his own list of users. The method checks whether a user is added into your list of users or not.
     * @function isAddedOrNot
     * @param d Details of the user to be checked into the list
     * @returns A boolean value
     */
    public isAddedOrNot = (d: any) => {
        const index = this.allUsersArray().findIndex((val: any) => val.user_id === d.user_id);
        if (index > -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * User details are passed. The method returns the class to be applied according to user status either online, offline or away.
     * @function statusClass
     * @param data User details
     * @returns Status of the user
     */
    public statusClass = (data: any) => {
        if (data.online_status) {
            switch (data.online_status) {
                case onlineStatus.online: return "_online";
                case onlineStatus.offline: return "_offline";
                case onlineStatus.away: return "_away";
            }
        }
    }

    /**
     * Returns profile image of the user
     * @function profileImg
     * @param data User details
     * @returns An image object if present otherwise false
     */
    public profileImg = (data: any) => {
        return data.profile_img ? data.profile_img : false;
    }

    /**
     * Closes all popovers
     * @function closePopover
     */
    public closePopover = () => {
        const win: any = window;
        win.WebuiPopovers.hideAll();
    }

    /**
     * Displays profile of a particular user
     * @function showProfile
     * @param data Details of the user whose profile is to be viewed
     */
    public showProfile = (data?: any) => {
        if (data) {
            const event = new CustomEvent("show-profile", { detail: data });
            document.body.dispatchEvent(event);
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
     */
    constructor() {
        const win: any = window;
        win.__collab_logout = this.logout;
        this.init();
    }
}
