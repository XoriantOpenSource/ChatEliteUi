import { appConfig } from "../../../../../configs/appConfig";
const recentTemplate = require(`./main.html`);
import { component } from "../../../../../decorators/component";
import getService from "../../../../../services/getService";
import * as ko from "knockout";
import { socketIOConstants, event_listeners, Constants } from "../../../../../configs/constants";
import { onlineStatus, notificationType } from "../../../../../configs/enums";
import { User } from "../../../../shared/model/user";

/**
 * Registers recentComponent as a component into knockout
 */
@component({
    name: "recentComponent",
    template: recentTemplate
})
/**
 * @class
 * @classdesc Contains logic for displaying content in the recent component
 */
export default class recentController {

    private _env = ko.observable(appConfig.env);
    private historyArray: KnockoutObservableArray<collab.component.IChatHistory> = ko.observableArray([]);
    private showChatComponent = ko.observable(false);
    private showLoader = ko.observable(false);
    private currentChatId = ko.observable(null);
    private allUsersNameArray = ko.observableArray([]);
    private allUsersArray = ko.observableArray([]);
    private subject = ko.observable("");
    private group_users = ko.observableArray([]);
    private TransferUsers = ko.observableArray([]);
    private CreteChatGrpModal: KnockoutObservable<boolean> = ko.observable(false);
    private current_user_obj: any = ko.observable({});
    private current_user = ko.observable("");
    private selectedIndex = ko.observable(0);
    private unread_messages = ko.observable("");
    private previous_title = document.title;
    private Query = ko.observable("");
    private playMessageTone: KnockoutObservable<boolean> = ko.observable(false);
    private subscriptions: Array<any> = [];
    private groupUsersList = ko.observableArray([]);
    private isCollapsed: KnockoutObservable<boolean> = ko.observable(true);
    private typingGroupId = ko.observable("");
    private typingUserName = ko.observable("");
    private showExpandCollapseIcon: KnockoutObservable<boolean> = ko.observable(true);
    private showSpinner: KnockoutObservable<boolean> = ko.observable(true);

    /**
     * Initializes recent tabs section
     */
    public init = () => {
        // Initializes tabs
        $("ul.tabs").tabs();
        this.current_user_obj(appConfig.user_details);
        this.current_user = appConfig.user_details.user_name;
        // displays loader
        this.showLoader(true);

        // Updates the last sent message in a conversation
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.last_Seen, (res: any) => {
            const index = this.historyArray().findIndex((val: any) => val._id === res._id);
            if (index > -1) {
                const grp: any = this.historyArray()[index];
                this.historyArray.splice(index, 1);
                grp.lastMessage = res.text;
                this.historyArray.splice(index, 0, grp);
            }
        }));

        // Creates a new chat group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.create_Chat_Group, (res: any) => {
            res.users = ko.observableArray(res.users);
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
            this.historyArray.unshift(res);
            if (res.created_by_user._id === this.current_user_obj()._id) {
                setTimeout(() => {
                    // Opens up the chat group once created
                    const event = new CustomEvent("_showChatComponent", { detail: res._id });
                    document.body.dispatchEvent(event);
                    this.currentChatId(res._id);
                }, 100);
                getService.errorServiceInstance().throwInfo("Created group " + res.subject + " Successfully.");
                this.selectedIndex(0);
            } else {
                this.unread_messages(res._id);
                document.title = "You have unread message(s)!";
                this.selectedIndex(this.selectedIndex() + 1);
                getService.notificationServiceInstance().notify("You have unread message in " + res.subject, notificationType.message, undefined, res._id);
            }
        }));

        // Opens up an existing conversation
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.show_Existing_Chat, (res: any) => {
            setTimeout(() => {
                const index = this.historyArray().map((el) => {
                    return el._id;
                }).indexOf(res._id);
                this.startChat(res);
                this.selectedIndex(index);
            });
        }));

        // notifies user has a unread message
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.unread_Messages, (res: any) => {
            const audio = new Audio("https://notificationsounds.com/soundfiles/68ce199ec2c5517597ce0a4d89620f55/file-sounds-954-all-eyes-on-me.mp3");
            audio.play();
            let index = this.historyArray().map((el) => {
                return el._id;
            }).indexOf(res._id);

            if (index > -1) {
                const group: any = this.historyArray()[index];
                group.last_access_date = new Date().toISOString();
                this.historyArray.splice(index, 1);
                this.historyArray.unshift(group);
            }
            if (this.currentChatId() !== res._id) {
                this.unread_messages(res._id);
                document.title = "You have unread message(s)!";
                index = this.historyArray().findIndex((val: any) => val._id === this.currentChatId());
                this.selectedIndex(index);
                getService.notificationServiceInstance().notify("You have unread message from " + res.user_name, notificationType.message, undefined, res._id);
            } else {
                this.selectedIndex(0);
            }
        }));

        // Removes the conversation group when chat is transferred by you
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.transfer_Chat_Group_Change, (res: any) => {
            const index = this.historyArray().map((el) => {
                return el._id;
            }).indexOf(res.group_id);
            if (index > -1) {
                this.historyArray.splice(index, 1);
                const win: any = window;
                win.WebuiPopovers.hideAll();
                // Display that the chat is transferred
                const event = new CustomEvent("_showTransferChatComponent", { detail: res });
                document.body.dispatchEvent(event);
                getService.errorServiceInstance().throwInfo("Successfully transferred Chat to " + res.users);
            }
        }));

        // Adds conversation group to your list of conversations when a chat is transferred to you
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.transfer_Chat, (res: any) => {
            res.online_user_count = ko.observable(0);
            res.unread_messages_count = 0;
            res.users = ko.observableArray(res.users);
            this.historyArray.unshift(res);
            this.unread_messages(res._id);
            document.title = "You have unread message(s)!";
            getService.notificationServiceInstance().notify("You have unread message in " + res.subject, notificationType.message, undefined, res._id);
            const index = this.historyArray().map((el) => {
                return el._id;
            }).indexOf(this.currentChatId());
            this.selectedIndex(index);
        }));

        // Listener to apply changes to when a user is added in a group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.add_Users_In_current_Grp, (res: any) => {
            res.online_user_count = ko.observable(0);
            res.unread_messages_count = 0;
            res.users = ko.observableArray(res.users);
            this.historyArray.unshift(res);
            this.unread_messages(res._id);
            document.title = "You have unread message(s)!";
            getService.notificationServiceInstance().notify("You have unread message in " + res.subject, notificationType.message, undefined, res._id);
            const index = this.historyArray().map((el) => {
                return el._id;
            }).indexOf(this.currentChatId());
            this.selectedIndex(index);
        }));

        // Listener to change for users who were already present in the group when a new user is added to the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.add_User_Change, (res: any) => {
            res.online_user_count = ko.observable(0);
            res.unread_messages_count = 0;
            const index = this.historyArray().map((el) => {
                return el._id;
            }).indexOf(res._id);
            res.users = ko.observableArray(res.users);
            if (index > -1) {
                this.historyArray.splice(index, 1);
                this.historyArray.unshift(res);

                if (this.currentChatId() !== res._id) {
                    this.unread_messages(res._id);
                    document.title = "You have unread message(s)!";
                    getService.notificationServiceInstance().notify("You have unread message in " + res.subject, notificationType.message, undefined, res._id);
                } else {
                    this.selectedIndex(0);
                    this.startChat(this.historyArray()[0]);
                }
            }

        }));

        // Prompts additional messages whenever user adds to or leaves a group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.user_message_prompt, (res: any) => {
            setTimeout(() => {
                getService.socketioInstance().sendData(socketIOConstants.chat, res);
            }, 2000);
        }));

        // Deletes the group when a user leaves it
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.leave_Group, (res: any) => {
            getService.socketioInstance().leaveGroup(res._id);
            const index = this.historyArray().map((el) => {
                return el._id;
            }).indexOf(res._id);
            if (index > -1) {
                this.historyArray.splice(index, 1);
            }
            if (this.historyArray().length) {
                this.selectedIndex(0);
                this.startChat(this.historyArray()[0]);
            } else {
                this.showChatComponent(false);
            }
            getService.errorServiceInstance().throwInfo("You have left the Group");
        }));

        // Update the other member(s) group information if someone leaves the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.leave_Group_Change, (res: any) => {
            res.online_user_count = ko.observable(0);
            res.unread_messages_count = 0;
            res.users = ko.observableArray(res.users);
            const index = this.historyArray().map((el) => {
                return el._id;
            }).indexOf(res._id);
            if (index > -1) {
                this.historyArray.splice(index, 1);
                this.historyArray.unshift(res);
                if (this.currentChatId() !== res._id) {
                    this.unread_messages(res._id);
                    document.title = "You have unread message(s)!";
                    getService.notificationServiceInstance().notify("You have unread message in " + res.subject, notificationType.message, undefined, res._id);
                } else {
                    this.selectedIndex(0);
                    this.startChat(this.historyArray()[0]);
                }
            }
        }));

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.ticker, (res: any) => {
            let group: any;
            for (group of this.historyArray()) {
                if (group.users()) {
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
            }
        }));

        // Changes a group name
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.change_Group_Subject, (res: any) => {
            const index = this.historyArray().findIndex((group: any) => group._id === res._id);
            if (index > -1) {
                const group = this.historyArray()[index];
                this.historyArray.splice(index, 1);
                group.subject = res.subject;
                this.historyArray.unshift(group);
                if (this.currentChatId() !== res._id) {
                    this.unread_messages(res._id);
                    document.title = "You have unread message(s)!";
                    this.selectedIndex(this.selectedIndex() + 1);
                    getService.notificationServiceInstance().notify("You have unread message in " + res.subject, notificationType.message, undefined, res._id);
                } else {
                    this.selectedIndex(0);
                }
            }
        }));

        // Displays count of unread messages in a converastion group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.unread_Chat, (res: any) => {
            for (const group of res) {
                const index = this.historyArray().findIndex((grp: any) => grp._id === group._id);
                if (index > -1) {
                    const grp: any = this.historyArray()[index];
                    if (grp.unread_messages_count !== group.count) {
                        this.historyArray.splice(index, 1);
                        grp.unread_messages_count = group.count;
                        this.historyArray.splice(index, 0, grp);
                    }
                }
                this.historyArray.sort((a: any, b: any) => {
                    return (b.unread_messages_count - a.unread_messages_count || new Date(b.last_access_date).getTime() - new Date(a.last_access_date).getTime());
                });
            }
            const index = this.historyArray().findIndex((val: any) => val._id === this.currentChatId());
            this.selectedIndex(index);
        }));

        // Rmeoves a conversation from your list
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.removeUserRecent, (res: any) => {
            const index = this.historyArray().findIndex((val: any) => val._id === res._id);
            const win: any = window;
            if (index > -1) {
                this.historyArray.splice(index, 1);
                if (this.historyArray()[0]) {
                    this.startChat(this.historyArray()[0]);
                    this.selectedIndex(0);
                }
                win.WebuiPopovers.hideAll();
                getService.errorServiceInstance().throwInfo(res.msg);
            }
        }));

        // Updates the last message whenever a new message is sent
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.last_Message, (res: any) => {
            const index = this.historyArray().findIndex((val: any) => val._id === res._id);
            if (index > -1) {
                const grp: any = this.historyArray()[index];
                this.historyArray.splice(index, 1);
                grp.lastMessage = res.text;
                this.historyArray.splice(index, 0, grp);
            }
        }));

        // Removes a conversation from a user's list if the creator of the group  removes you from the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.remove_user_from_grp_change, (res: any) => {
            const index = this.historyArray().findIndex((val: any) => val._id === res.group_id);
            if (index > -1) {
                this.historyArray.splice(index, 1);
                getService.errorServiceInstance().throwInfo(`Admin removed you from "${res.subject} group.`);
                if (this.currentChatId() === res.group_id) {
                    this.selectedIndex(0);
                    this.startChat(this.historyArray()[0]);
                }
            }
        }));

        // Update the group details in recent tab of other group members on whenever a user is removed by creator of the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.remove_user_change_in_recent, (res: any) => {
            const index = this.historyArray().findIndex((val: any) => val._id === res.group_id);
            if (index > -1) {
                const ind = (<any>this.historyArray()[index]).users().findIndex((val: any) => val._id === res._id);
                if (ind > -1) {
                    (<any>this.historyArray()[index]).users.splice(ind, 1);
                }
            }
        }));

        // Send conversation groups' details to groups component
        document.body.addEventListener("_sendHistoryData", (e: any) => {
            const event = new CustomEvent("_historyData", { detail: this.historyArray() });
            document.body.dispatchEvent(event);
        });
    }
    /**
     * When a user clicks on a user or a group, it sets the index of the clicked upon element from the list as selected index, denoting the particular element is selected.
     * @function onIndexSelected
     * @param index Index of conversation in the list of conversations the user has had
     */
    public onIndexSelected = (index: any) => {
        this.selectedIndex(index);
    }

    /**
     * When a user clicks on a username or a group name, startChat opens up an existing conversation with a particular user or group.
     * @function startChat
     * @param chatIndex Details of the conversation
     * @param index null
     */
    public startChat = (chatIndex: collab.component.IChatHistory, index: number = null) => {
        const event = new CustomEvent("_showChatComponent", { detail: chatIndex._id });
        document.body.dispatchEvent(event);
        this.currentChatId(null);
        this.currentChatId(chatIndex._id);
    }

    /**
     * A user may have many unread messages. totalUnreadMessages returns the count of unread messages including all groups.
     * @function totalUnreadMessages
     * @param groupId ID of the conversation group
     * @returns A numeric count of total unread messages
     */
    public totalUnreadMessages = (groupId: string) => {
        const msgCount = getService.utilsInstance().find(this.historyArray(), (val: any) => val.group_id === groupId).unread_messages;
        return msgCount || 0;
    }
    /**
     * Focusses on the search box
     */
    public focusOnSearch = () => {
        document.getElementById("_conversationSearch").focus();
    }

    /**
     * A user can create a group with minimum 3 users. The method allows you to create a conversation group with the specified users.
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
        this.group_users().push(this.current_user_obj()._id);

        getService.socketioInstance().sendData(socketIOConstants.create_Chat_Group, { subject: this.subject().trim(), users: this.group_users() });
    }
    /**
     * Returns the searched groupname or username when a user enters a name in the searchbox
     * @function searchResults
     * @returns Returns the searched groupname or username
     */
    public searchResults = ko.computed(() => {
        const q = this.Query().toLowerCase();
        return this.historyArray().filter((i: any) => {
            return i.subject.toLowerCase().indexOf(q) >= 0;
        });
    });

    public changeIcon = () => {
        this.Query("");
    }

    public selectOptionStyling = (option: any, item: any) => {
        if (item.online_status === onlineStatus.online) {
            ko.applyBindingsToNode(option, {
                css: {
                    online_color: true
                }
            }, item);
        }
    }

    /**
     * User details are passed. otherUsersOnlineStatus() returns which class must be applied according to the status of other user if p2p, else applies class for group.
     * @function otherUsersOnlineStatus
     * @returns Status of user if p2p or else a group
     * @description Applies the class according to the status of user if p2p, else applies class for group
     */
    public otherUsersOnlineStatus = (data: any) => {
        const user = data.users().filter((val: any) => { return val._id !== this.current_user_obj()._id; })[0];
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
        const user = data.users().filter((val: any) => { return val._id !== this.current_user_obj()._id; })[0];
        if (user && user.profile_img) {
            return user.profile_img;
        } else {
            return false;
        }
    }

    /**
     * Returns the count of total online users in a particular group
     * @function totalOnlineUsers
     * @param data Array of users in group conversation
     * @returns Returns the count of total online users in a particular group
     */
    public totalOnlineUsers = (data: any) => {
        return data.filter((val: any) => val.online_status === onlineStatus.online).length;
    }

    /**
     * Disposes all subscriptions of the controller socket methods
     */
    public dispose() {
        getService.socketioInstance().unsubscribe(this.subscriptions);
    }

    /**
     * An individual user has a list of all the conversations he has had till now. The removeUserRecent method allows a user to remove a conversation group from your list from the recent chats.
     * @function removeUserRecent
     * @param res Details of the conversation to be removed from your list
     */
    public removeUserRecent = (res: any) => {
        getService.socketioInstance().sendData(socketIOConstants.removeUserRecent, { conversation_id: res._id });
        this.closePopover();
    }

    /**
     *  Closes all popovers
     * @function closePopover
     */
    public closePopover = () => {
        const win: any = window;
        win.WebuiPopovers.hideAll();
    }

    /**
     * Displays the profile of a particular user
     * @function showProfile
     * @param data Details of the user whose profile is to be displayed
     */
    public showProfile = (data: any) => {
        const group = data;
        const x = group.users().find((val: any) => val.user_id !== this.current_user_obj().user_id);
        if (x) {
            const event = new CustomEvent("show-profile", { detail: x });
            document.body.dispatchEvent(event);
        }
    }

    /**
     * @constructor
     */
    constructor() {
        this.init();
        $(document).off(event_listeners.cacheHistory);
        // Caches the conversation history
        $(document).on(event_listeners.cacheHistory, (e: any) => {

            this.historyArray([]);
            for (const group of e.detail) {
                if (group.subject === this.current_user) {
                    for (const user of group.users) {
                        if (user._id !== this.current_user_obj()._id) {
                            group.subject = user.user_name;
                        }
                    }
                }
                group.online_user_count = ko.observable(0);
                group.unread_messages_count = 0;
                group.users = ko.observableArray(group.users);
                group.users.sort((a: any, b: any) => {
                    return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
                });
            }
            this.historyArray.push.apply(this.historyArray, e.detail);
            this.showLoader(false);
            this.showSpinner(false);

            if (this.historyArray()[0]) {
                this.startChat(this.historyArray()[0]);
            } else {
                const event = new CustomEvent("_no-recent-chat", { detail: "" });
                document.body.dispatchEvent(event);
            }

        });
        getService.cacheChatInstance().cacheHistory(this.current_user_obj().user_id);

        this.historyArray.subscribe((val) => {
            const event = new CustomEvent("_arrayChange", { detail: this.historyArray() });
            document.body.dispatchEvent(event);
        }, null, "arrayChange");
    }

}
