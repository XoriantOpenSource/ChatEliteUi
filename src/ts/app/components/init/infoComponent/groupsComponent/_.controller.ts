import { appConfig } from "../../../../../configs/appConfig";
import { component } from "../../../../../decorators/component";
import { socketIOConstants } from "../../../../../configs/constants";
import getService from "../../../../../services/getService";
import * as ko from "knockout";
import { onlineStatus } from "../../../../../configs/enums";
const groupsTemplate = require("./main.html");

/**
 * Registers groupsComponent as a component in knockout
 */
@component({
    name: "groupsComponent",
    template: groupsTemplate
})
/**
 * @class
 * @classdesc Contains logic for display and operations of the groups component
 */
export default class groupsController {

    private _env = ko.observable(appConfig.env);
    private subscriptions: Array<any> = [];
    private showLoader = ko.observable(false);
    private groupArray: KnockoutObservableArray<collab.component.IChatHistory> = ko.observableArray([]);
    private current_user_obj: any = ko.observable({});
    private current_user = ko.observable("");
    private currentChatId = ko.observable(null);
    private showChatComponent = ko.observable(false);
    private groupsQuery = ko.observable("");
    private allUsersNameArray = ko.observableArray([]);
    private allUsersArray = ko.observableArray([]);
    private subject = ko.observable("");
    private group_users = ko.observableArray([]);
    private groupUsersList = ko.observableArray([]);
    private selectedIndex = ko.observable(0);

    /**
     * Initializes the groups tab
     */
    public init() {
        this.current_user_obj(appConfig.user_details);
        $(".collapsible").collapsible();

        // initialize all modals
        $(".modal").modal();
        // Displays loading icon
        this.showLoader(true);
        document.body.addEventListener("_historyData", (e: any) => {
            const res = e.detail;
            for (let i = 0; i < res.length; i++) {
                const group = res[i];
                if (!group.isP2PChat) {
                    if (!group.online_user_count()) {
                        group.online_user_count = ko.observable(0);
                    }
                    group.unread_messages_count = 0;
                    if (!group.users()) {
                        group.users = ko.observableArray(group.users);
                    }
                    group.users.sort((a: any, b: any) => {
                        return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
                    });
                    this.groupArray.push(group);
                }
            }
            this.showLoader(false);
        });

        const event = new CustomEvent("_sendHistoryData", { detail: "" });
        document.body.dispatchEvent(event);

        // this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.history, (res: any) => {
        //     for (let i = 0; i < res.length; i++) {
        //         let group = res[i];
        //         if (!group.isP2PChat) {
        //             if (!group.online_user_count())
        //                 group.online_user_count = ko.observable(0);
        //             group.unread_messages_count = 0;
        //             if (!group.users())
        //                 group.users = ko.observableArray(group.users);
        //             group.users.sort((a: any, b: any) => {
        //                 return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
        //             });
        //             this.groupArray.push(group);
        //         }
        //     }
        //     this.showLoader(false);
        //     // this.totalOnlineUser();
        // }));
        // Listener to update last sent message in a group conversation
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.last_Seen, (res: any) => {
            const index = this.groupArray().findIndex((val: any) => val._id === res._id);
            if (index > -1) {
                const grp: any = this.groupArray()[index];
                this.groupArray.splice(index, 1);
                grp.lastMessage = res.text;
                this.groupArray.splice(index, 0, grp);

            }

        }));

        this.allUsersArray(getService.sharedDataServiceInstance().allUsersfromDb);
        // Listener to create chat group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.create_Chat_Group, (res: any) => {
            // res.users = ko.observableArray(res.users);
            if (!res.isP2PChat) {
                if (res.subject === this.current_user) {
                    res.subject = res.created_by_user.user_name;
                }
                res.online_user_count = ko.observable(0);
                res.unread_messages_count = 0;
                const grp = {
                    group_id: res._id,
                    users: res.users
                };
                this.groupUsersList.unshift(grp);
                this.groupArray.unshift(res);
                if (res.created_by_user._id === this.current_user_obj()._id) {
                    this.startChat(res);
                    this.selectedIndex(0);
                } else {
                    this.selectedIndex(this.selectedIndex() + 1);
                }
            }
        }));

        // Listener to delete a chat from your list if you have transferred it
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.transfer_Chat_Group_Change, (res: any) => {
            const index = this.groupArray().map((el) => {
                return el._id;
            }).indexOf(res.group_id);
            if (index > -1) { this.groupArray.splice(index, 1); }
        }));

        // Listener to transfer a chat to a user
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.transfer_Chat, (res: any) => {
            // res.online_user_count = ko.observable(0);
            // res.unread_messages_count = 0;;
            // res.users = ko.observableArray(res.users);
            this.groupArray.unshift(res);
        }));

        // Listener to apply changes to when a user is added in a group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.add_Users_In_current_Grp, (res: any) => {
            // res.online_user_count = ko.observable(0);
            // res.unread_messages_count = 0;
            // res.users = ko.observableArray(res.users);
            this.groupArray.unshift(res);
        }));

        // Listener to change for users who were already present in the group when a new user is added to the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.add_User_Change, (res: any) => {
            // res.online_user_count = ko.observable(0);
            // res.unread_messages_count = 0;
            // res.users = ko.observableArray(res.users);
            const index = this.groupArray().map((el) => {
                return el._id;
            }).indexOf(res._id);
            if (index > -1) {
                this.groupArray.splice(index, 1);
                this.groupArray.unshift(res);
            }
        }));

        // Deletes the group when a user leaves it
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.leave_Group, (res: any) => {
            const index = this.groupArray().map((el) => {
                return el._id;
            }).indexOf(res._id);
            if (index > -1) { this.groupArray.splice(index, 1); }
        }));

        // Update the other member(s) group information if someone leaves the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.leave_Group_Change, (res: any) => {
            // res.online_user_count = ko.observable(0);
            // res.unread_messages_count = 0;
            // res.users = ko.observableArray(res.users);
            const index = this.groupArray().map((el) => {
                return el._id;
            }).indexOf(res._id);
            if (index > -1) {
                this.groupArray.splice(index, 1);
                this.groupArray.unshift(res);
            }
        }));

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.ticker, (res: any) => {
            let group: any;
            for (group of this.groupArray()) {
                const index = group.users().findIndex((val: any) => val._id === res.user._id);
                if (index > -1) {
                    group.users().splice(index, 1);
                    group.users().push(res.user);
                    const filterusers = group.users().filter((val: any) => val.online_status === onlineStatus.online);
                    group.online_user_count = ko.observable(filterusers.length);
                }
                group.users.sort((a: any, b: any) => {
                    return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
                });
            }
        }));

        // Changes a group name
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.change_Group_Subject, (res: any) => {
            const index = this.groupArray().findIndex((group: any) => group._id === res._id);
            if (index > -1) {
                const group = this.groupArray()[index];
                this.groupArray.splice(index, 1);
                group.subject = res.subject;
                this.groupArray.unshift(group);
            }
        }));

        // Updates the last sent message in a conversation
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.last_Message, (res: any) => {
            const index = this.groupArray().findIndex((val: any) => val._id === res._id);
            if (index > -1) {
                const grp: any = this.groupArray()[index];
                this.groupArray.splice(index, 1);
                grp.lastMessage = res.text;
                this.groupArray.splice(index, 0, grp);
            }
        }));

        // Updates the list of conversation when a conversation is deleted
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.removeUserRecent, (res: any) => {
            const index = this.groupArray().findIndex((val: any) => val._id === res._id);
            const win: any = window;
            if (index > -1) {
                this.groupArray.splice(index, 1);
                win.WebuiPopovers.hideAll();
            }
        }));
    }
    /**
     * When a user clicks on a group, it sets the index of the clicked upon element from the list as selected index, denoting the particular element is selected.
     * @function onIndexSelected
     * @param index Index of conversation
     * @description Sets index as selected one
     */
    public onIndexSelected = (index: any) => {
        this.selectedIndex(index);
    }

    /**
     *  When a user clicks on a group name, startChat opens up an existing conversation with a particular group.
     * @function startChat
     * @param chatIndex Index of conversation group
     * @description Opens up a conversation of a group
     */
    public startChat = (chatIndex: collab.component.IChatHistory) => {
        const event = new CustomEvent("_showChatComponent", { detail: chatIndex._id });
        document.body.dispatchEvent(event);
        this.currentChatId(chatIndex._id);
    }

    // totalOnlineUser = () => {
    //     getService.socketioInstance().sendData(socketIOConstants.conversation_user_online);
    //     getService.socketioInstance().subscribe(socketIOConstants.conversation_user_online, (res: any) => {
    //         for (let group of res) {
    //             let oldItem: any = this.groupArray().filter((val: any) => val._id === group._id)[0];
    //             if (oldItem) {
    //                 let newItem = getService.utilsInstance().cloneDeep(oldItem);
    //                 newItem.online_user_count = ko.observable(group.online_user_count);
    //                 newItem.onlineUsers = ko.observable(group.onlineUsers);
    //                 newItem.users = oldItem.users;
    //                 this.groupArray.replace(oldItem, newItem);
    //             }
    //         }
    //     });
    // }

    /**
     *  A user can create a group with minimum 3 users. The method allows you to create a conversation group with the specified users.
     * @function chatGroupCreation
     */
    public chatGroupCreation = () => {
        if (this.group_users().length === 0) {
            getService.errorServiceInstance().throwError("Select at least one user for group");
            return;
        } else if (this.group_users().length === 1) {
            getService.errorServiceInstance().throwError("Select minimum two users for group");
            return;
        }

        if (!this.subject().trim()) {
            getService.errorServiceInstance().throwError("Add a subject for the group");
            return;
        }
        this.group_users().push(appConfig.user_details._id);
        // Creates a chat group
        getService.socketioInstance().sendData(socketIOConstants.create_Chat_Group, { subject: this.subject().trim(), users: this.group_users() });
        $("._title_group_modal").val("");
        this.group_users.removeAll();
    }
    /**
     * A user can have multiple groups. The method searches for particular group and bounces back the result.
     * @function searchGroupsResults
     * @returns Returns the searched group name(s)
     */
    public searchGroupsResults = ko.computed(() => {
        const q = this.groupsQuery().toLowerCase();
        return this.groupArray().filter((i: any) => {
            return i.subject.toLowerCase().indexOf(q) >= 0;
        });
    });

    /**
     * Focusses on the search box
     */
    public focusOnSearch = () => {
        document.getElementById("_groupsSearch").focus();
    }

    public changeIcon = () => {
        this.groupsQuery("");
    }
    /**
     * When a user wants to create a group, a modal pops up asking for group details to be created. closeGroupModal closes the modal opened for group creation.
     * @function closeGroupModal
     */
    public closeGroupModal = () => {
        this.group_users([]);
        this.subject("");
    }

    /**
     * A user has a list of all the groups that he is a participant of. He can remove a particular group from his list only if he is the creator of that group. removeUserRecent removes a group conversation from your list.
     * @function removeUserRecent
     * @param res conversation group details that is to be removed
     */
    public removeUserRecent = (res: any) => {
        getService.socketioInstance().sendData(socketIOConstants.removeUserRecent, { conversation_id: res._id });
        this.closePopover();
    }

    /**
     * Closes the popover
     * @function closePopover
     */
    public closePopover = () => {
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
     */
    constructor() {
        this.init();
    }
}
