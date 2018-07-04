import { component } from "../../../../../decorators/component";
const introTemplate = require("./main.html");
import { appConfig } from "../../../../../configs/appConfig";
import * as ko from "knockout";
import getService from "../../../../../services/getService";
import { socketIOConstants } from "../../../../../configs/constants";
import { onlineStatus } from "../../../../../configs/enums";

/**
 * @class
 * @classdesc Contains logic for displaying content in the introComponent i.e. the leftmost panel.
 */
@component({
    name: "introComponent",
    template: introTemplate
})
export default class introController {

    private _env = ko.observable(appConfig.env);
    private group_id = ko.observable(null);
    private subscriptions: Array<any> = [];
    private groupDetails: any = ko.observable({ users: [] });
    private showLoader = ko.observable(false);
    private favMessagesArray = ko.observableArray([]);
    private linksArray = ko.observableArray([]);
    private receiver: any = ko.observable({});
    private Query = ko.observable("");
    private allUsers = ko.observableArray([]);
    private showAddUser = ko.observable(false);
    private memebersLimit = ko.observable(5);
    private showUserList = ko.observable(false);
    private commonGroupsArray = ko.observableArray([]);
    private showLoader1 = ko.observable(false);
    private showLoader2 = ko.observable(false);
    private showLoader3 = ko.observable(false);
    private removeDetailsEnabled = ko.observable("");
    private showRemoveUserLoader = ko.observable(false);
    private currentUserId = ko.observable("");
    /**
     * Initializes the intro component
     */
    public init() {

        this.showLoader(true);
        this.showLoader1(true);
        this.showLoader2(true);
        this.showLoader3(true);
        getService.socketioInstance().getData(socketIOConstants.all_Users_Chat_Transfer, { _id: this.group_id }).then((res: any) => {
            this.allUsers(res);
            this.allUsers.sort((a: any, b: any) => {
                if (a.user_name < b.user_name) { return -1; }
                if (a.user_name > b.user_name) { return 1; }
                return 0;
            });
        });
        // Get entire details of the conversation group
        getService.socketioInstance().sendData(socketIOConstants.group_Details, { _id: this.group_id() });
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.group_Details, (res: any) => {
            if (res.subject === appConfig.user_details.user_name) {
                for (const user of res.users) {
                    if (user._id !== appConfig.user_details._id) {
                        this.receiver(user);
                        res.subject = user.user_name;
                    }
                }
            } else {
                for (const user of res.users) {
                    if (user._id !== appConfig.user_details._id) {
                        this.receiver(user);
                    }
                }
            }
            res.users.sort((a: any, b: any) => {
                return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
            });
            res.users = ko.observableArray(res.users);
            this.showLoader(false);
            this.groupDetails(res);
        }));

        // Get all the links sent int the particular group
        getService.socketioInstance().sendData(socketIOConstants.get_Links, { group_id: this.group_id() });
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.get_Links, (res: any) => {
            this.linksArray(res);
            this.showLoader1(false);
        }));

        // Get the messages marked as favorites from a particular group
        getService.socketioInstance().sendData(socketIOConstants.get_Favorite_Messages, { _id: this.group_id() });
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.get_Favorite_Messages, (res: any) => {
            this.favMessagesArray(res);
            this.showLoader2(false);
        }));

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.mark_favorite, (res: any) => {
            this.favMessagesArray.unshift(res);
        }));

        // whenever a link is sent in a group,it adds it to links panel
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.add_To_Links, (res: any) => {
            const index = this.linksArray().findIndex((val: any) => val.txt === res.txt[0]);
            if (index === -1) { this.linksArray.unshift(res); }

        }));

        // Unmarks a message from favorites list
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.unmark_favorite, (res: any) => {
            const index = this.favMessagesArray().findIndex((val: any) => val.text === res.text);
            if (index !== -1) { this.favMessagesArray.splice(index, 1); }
        }));

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.ticker, (res: any) => {
            const group: any = this.groupDetails();
            if (group && group.users && group.users()) {
                const index = group.users().findIndex((val: any) => val._id === res.user._id);
                if (index > -1) {
                    if (this.receiver() && res.user._id === this.receiver()._id) {
                        this.receiver(res.user);
                    }
                    group.users().splice(index, 1);
                    group.users().push(res.user);
                }

                group.users.sort((a: any, b: any) => {
                    return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
                });
            }
        }));

        // Change or edit group name
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.change_Group_Subject, (res: any) => {
            if (this.group_id() === res._id) {
                const elem = document.getElementById("_groupTitle");
                elem.innerHTML = res.subject;
                elem.title = res.subject;
                this.groupDetails().subject = res.subject;
            }
        }));

        // Updates the group details whenever a new user is added to the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.add_User_Change, (res: any) => {
            if (!res.users()) {
                res.users = ko.observableArray(res.users);
            }
            res.users.sort((a: any, b: any) => {
                return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
            });
            res.created_by_user = typeof res.created_by_user === "string" ? res.created_by_user : res.created_by_user._id;
            this.groupDetails(res);
            this.showAddUser(false);
        }));

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.get_Common_Groups, (res: any) => {
            this.commonGroupsArray(res);
            this.showLoader3(false);
        }));

        // If a message is deleted ,it is removed from the favorites or links section provided the deleted message already was there
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.delete_Mess, (res: any) => {
            let index = this.favMessagesArray().findIndex((val: any) => val.chat_id === res);
            if (index !== -1) {
                this.favMessagesArray.splice(index, 1);
            }
            index = this.linksArray().findIndex((val: any) => val.chat_id === res);
            if (index !== -1) {
                this.linksArray.splice(index, 1);
            }
        }));

        // Update the list of users in the group whenever a  user leaves a group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.leave_Group_Change, (res: any) => {
            if (res._id === this.group_id()) {
                this.groupDetails(res);
                const index = this.allUsers().findIndex((val: any) => val._id === res.leftUser._id);
                if (index === -1) {
                    this.allUsers().push(res.leftUser);
                }
            }
        }));

        this.currentUserId(appConfig.user_details._id);

        // Update the group details whenever the group creator removes a user from the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.remove_user_from_grp, (res: any) => {
            let removedUser: any;
            const index = this.groupDetails().users().findIndex((val: any) => val._id === res._id);
            if (index !== -1) {
                removedUser = this.groupDetails().users()[index];
                this.allUsers().push(removedUser);
                this.showRemoveUserLoader(false);
                if (this.currentUserId() === res.removedBy) {
                    getService.errorServiceInstance().throwInfo(res.user_name + " removed successfully.");
                }
                this.closeAllPopover();
                this.groupDetails().users.splice(index, 1);
            }
        }));
    }

    public classRow = (index: any) => {
        return (index() + 1) % 3 === 0;
    }

    /**
     * User's details are passed. The method returns the class to be applied according to user status either online, offline or away.
     * @function userStatus
     * @param user User details
     * @returns Status of the user
     */
    public userStatus = (user: any) => {
        switch (user.online_status) {
            case onlineStatus.online: return "_online";
            case onlineStatus.offline: return "_offline";
            case onlineStatus.away: return "_away";
        }
    }

    /**
     * An individual user has his own list of users. The method searches for particular user from the list.
     * @function searchUsersResults
     * @returns Username from the search list
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

    /**
     * An individual user has his own list of users. The method checks whether a user is added into your list of users or not.
     * @function isAddedOrNot
     * @param d Details of the user to be checked into the list
     * @returns A boolean value
     */
    public isAddedOrNot = (d: any) => {
        const index = this.groupDetails().users().findIndex((val: any) => val._id === d._id);
        if (index > -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *  A user may search for other users. The method displays the search box for searching users to be added to the group.
     * @function showAddUserSearch
     */
    public showAddUserSearch = () => {
        this.showAddUser(!this.showAddUser());

        if (this.showAddUser()) {
            $("#_introUserSearch").focusin(() => {
                this.showUserList(true);
            });
            $("body").click((evt) => {
                // For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
                if ($(evt.target).closest("#_find-users").length) {
                    $("#_introUserSearch").focus();
                    return;
                }
                // Do processing of click event here for every element except with id menu_content
                if (evt.target.id !== "_introUserSearch") { this.showUserList(false); }
            });
        }
    }

    /**
     * A group contains various members. A user can add other users to the group that he is a part of.
     * @function addUser
     * @param data contains information about user(s) to be added to the group
     */
    public addUser = (data: any) => {
        if (data) {
            getService.socketioInstance().sendData(socketIOConstants.add_User, { _id: this.group_id(), users: [data._id] });
        } else {
            getService.errorServiceInstance().throwError("Select at least one user");
        }
    }

    public focusonGroupTitle = () => {
        $("#_groupTitle").click();
    }

    /**
     * A user may change or edit the name of the group that he is a part of.
     * @function editSubject
     * @param data Contains new name for the group
     */
    public editSubject = (data: any) => {
        if (!data.isP2PChat && !$(".thVal").is(":focus")) {
            const elem = document.getElementById("_groupTitle");
            const value = data.subject;
            if (value.indexOf("input") === -1) {
                elem.innerHTML = "";
                const inputElem = document.createElement("input");
                inputElem.className = "thVal";
                inputElem.id = "editGroupTitle";
                inputElem.type = "text";
                inputElem.setAttribute("maxlength", "20");
                inputElem.value = value;
                elem.appendChild(inputElem);
                inputElem.focus();

                document.getElementById("editGroupTitle").addEventListener("click", function (e) {
                    const target: any = e.target;
                    const position = target.selectionStart; // Capture initial position
                    // target.value = target.value.replace(/\s/g, "");  // This triggers the cursor to move.
                    target.value = target.trim();
                    target.selectionEnd = position;    // Set the cursor back to the initial p
                });

                inputElem.onblur = () => {

                    if (inputElem.value !== value) {
                        const elemvalue = inputElem.value;
                        const changedSubject: string = elemvalue.trim();
                        if (changedSubject.length < 3) {
                            getService.errorServiceInstance().throwError("Enter minimum 3 characters!");
                        } else {
                            getService.socketioInstance().sendData(socketIOConstants.change_Group_Subject, { _id: this.group_id(), subject: changedSubject });
                        }
                    }
                    elem.setAttribute("title", value);
                    elem.innerHTML = getService.utilsInstance().makeEllipsis(value, 12);
                    inputElem.remove();
                };
                return true;
            }
        }
    }

    /**
     * Group details are passed. otherUsersOnlineStatus() returns which class must be applied according to the status of other user if p2p, else applies class for group.
     * @function otherUsersOnlineStatus
     * @returns Status of user if p2p or else a group
     */
    public otherUsersOnlineStatus = () => {
        const user = this.groupDetails().users().filter((val: any) => { return val._id !== appConfig.user_details._id; })[0];
        if (user) {
            switch (user.online_status) {
                case onlineStatus.online: return "_online";
                case onlineStatus.offline: return "_offline";
                case onlineStatus.away: return "_away";
            }
        } else {
            return "_group";
        }
    }

    /**
     * User details are passed. The method returns the profile image of other user if present, otherwise default image is shown.
     * @function otherUserProfileImage
     * @param data Details of the other user
     * @returns An image object
     */
    public otherUserProfileImage = (data: any) => {
        const user = this.groupDetails().users().filter((val: any) => { return val._id !== appConfig.user_details._id; })[0];
        if (user && user.profile_img) {
            return user.profile_img;
        } else {
            return false;
        }
    }

    /**
     * @description Returns profile image of the user
     * @function profileImg
     * @param data User details
     * @returns An image object if present, otherwise false
     */
    public profileImg = (data: any) => {
        return data.profile_img ? data.profile_img : false;
    }

    /**
     * A user can create a group of minimum 3 members. The method returns the count of members in a particular group.
     * @function groupMembersCount
     * @returns A numeric value
     */
    public groupMembersCount = () => {
        if (this.groupDetails().isP2PChat === false) {
            return this.groupDetails().isP2PChat ? 0 : this.groupDetails().users().length;
        }
    }

    /**
     * Displays all members of group on clicking the 'plus' icon in intro component.
     */
    public expandGroupMembers = () => {
        if ($("#_expandArrow").hasClass("active")) {
            $("#_expandArrow").removeClass("active");
            $("._favourite-content").removeClass("_contract-content");
            $("._link_content").removeClass("_contract-content");
            this.memebersLimit(5);
        } else {
            $("#_expandArrow").addClass("active");
            $("._favourite-content").addClass("_contract-content");
            $("._link_content").addClass("_contract-content");
            this.memebersLimit(100);
        }
    }

    /**
     * A group consists of various members. The creator of the group can remove a member from a group. The method displays 'remove' icon for removing user on hovering on the user image.
     * @function enableRemoveDetails
     * @param _id ID of the user to be removed
     */
    public enableRemoveDetails = (_id) => {
        this.removeDetailsEnabled(_id);
    }

    /**
     *  A group consists of various members. The creator of the group can remove a member from a group. The method hides 'remove' icon for removing user on mouseout event.
     * @function disableRemoveDetails
     */
    public disableRemoveDetails = () => {
        this.removeDetailsEnabled("");
    }

    /**
     * A group consists of various members. The method allows the creator of the group to remove a member from a group.
     * @function removeUser
     * @param user_id ID of the user to be removed
     * @param username Username of the user to be removed
     */
    public removeUser = (user_id, username) => {
        this.showRemoveUserLoader(true);
        getService.socketioInstance().sendData(socketIOConstants.remove_user_from_grp, { _id: user_id, group_id: this.group_id(), user_name: username });
    }

    /**
     * Closes all popovers
     * @function closeAllPopover
     */
    public closeAllPopover = () => {
        const win: any = window;
        win.WebuiPopovers.hideAll();
    }

    /**
     * Disposes all subscriptions of the controller socket methods
     */
    public dispose() {
        getService.socketioInstance().unsubscribe(this.subscriptions);
    }

    /**
     * @constructor
     * @param params Contains ID of the group
     */
    constructor(params: any) {
        this.group_id(params.group_id());
        this.init();
    }
}
