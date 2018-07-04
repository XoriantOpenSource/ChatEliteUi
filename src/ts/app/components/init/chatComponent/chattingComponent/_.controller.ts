import { component } from "../../../../../decorators/component";
const chattingTemplate = require("./main.html");
import { appConfig } from "../../../../../configs/appConfig";
import * as ko from "knockout";
import getService from "../../../../../services/getService";
import chatService from "./chatService";
import { socketIOConstants, event_listeners } from "../../../../../configs/constants";
import { onlineStatus, chatType, notificationType } from "../../../../../configs/enums";

@component({
    name: "chattingComponent",
    template: chattingTemplate
})
export default class chattingController {

    private _env = ko.observable(appConfig.env);
    private chatDisabled = ko.observable(false);
    private suggestText = ko.observableArray();
    private chatArray = ko.observableArray([]);
    private conversation: any = ko.observable({});
    private chatText = ko.observable("").extend({ throttle: 250 });
    private group_id: string;
    private current_user: any = {};
    private ticker_userObservable: any = ko.observable({});
    private expandView = ko.observable(true);
    private userTyping: KnockoutObservable<boolean> = ko.observable(false);
    private typingUser = ko.observable("");
    private tempDate = "";
    private allUsersNameArray = ko.observableArray([]);
    private allUsersArray = ko.observableArray([]);
    private TransferUsers = ko.observableArray([]);
    private Query = ko.observable("");
    private docMessage = ko.observable();
    private originalFileName = ko.observable("");
    private isWindowFocused = true;
    private chatTotalCount: number;
    private pageNo: number;
    private subscriptions: Array<any> = [];
    private progress: KnockoutObservable<number> = ko.observable(0);
    private readMessageUserList = ko.observableArray([]);
    private allUsers = ko.observableArray([]);
    private showSpinnerForChatHistory: KnockoutObservable<boolean> = ko.observable(false);
    private p2p_status = ko.observable(true);
    private sheight: any = 0;
    private current_user_obj: any = ko.observable({});
    private chat_user_obj: any = ko.observable({});
    private searchChats: any = ko.observable(false);
    private searchChatText: any = ko.observable("");
    private groupDetails: any = ko.observable([]);
    private showAddUser: any = ko.observable(false);
    private addGroupUsers: any = ko.observable([]);
    private showReplyBox: KnockoutObservable<boolean> = ko.observable(false);
    private selectedReplyMessageID: KnockoutObservable<string> = ko.observable("");
    private replyOf: any = ko.observable({});
    /**
     * Initializes chatting Component
     */
    public init = () => {

        if (!$(".__chatComponent_c").is(":visible")) {
            $(".__chatComponent_c").show();
        }

        $(".dropdown-button").dropdown();
        // Display loading icon
        this.showSpinnerForChatHistory(true);
        $("#chatText,._chatText_c").data("place_holder", $("#chatText").attr("placeholder"));
        $("#chatText,._chatText_c").focus(() => {
            $("#chatText,._chatText_c").attr("placeholder", "");
            $("._chat-textarea").addClass("_focus_area");
        }).focusout(() => {
            $("#chatText,._chatText_c").attr("placeholder", $("#chatText,._chatText_c").data("place_holder"));
            $("._chat-textarea").removeClass("_focus_area");
        });

        if ($("div#__chattingComponent").hasClass("m3")) {
            $("._prevDate").removeClass("m5");
            $("._prevDate").addClass("m2");
            $("._chatIcons").removeClass("m3");
            $("._chatIcons").addClass("m6");
        }
        this.current_user_obj(appConfig.user_details);
        // getService.socketioInstance().getData(socketIOConstants.chat_User).then((res: any) => {
        this.current_user = appConfig.user_details;
        // });

        // Sets all unread messages of a conversation group as read when clicked when opened
        getService.apiServiceInstance().postData(appConfig.server_url + "/v1/discussion/unsetUnreadMsgscount", { _id: this.group_id });

        // Contains list of users in a particular group
        getService.socketioInstance().getData(socketIOConstants.all_Users_Chat_Transfer, { _id: this.group_id }).then((res: any) => {
            this.allUsersArray(res);
            this.allUsersArray.sort((a, b) => {
                return (a.user_name < b.user_name) ? -1 : (a.user_name > b.user_name) ? 1 : 0;
            });
        });

        getService.socketioInstance().getData(socketIOConstants.conversation, { _id: this.group_id }).then((res: any) => {
            this.p2p_status(res.isP2PChat);
            if (res.subject === this.current_user.user_name) {
                for (const user of res.users) {
                    if (user._id !== this.current_user._id) {
                        res.subject = user.user_name;
                    }
                }
            }
            this.conversation(res);
            if (res.isP2PChat) {
                const user = res.users.find(val => val._id !== this.current_user._id);
                this.ticker_userObservable(user);
                this.chat_user_obj(user);
                this.groupDetails(res.users);
            } else {
                this.chat_user_obj(res);
                this.groupDetails(res.users);
            }
        });

        getService.socketioInstance().sendData(socketIOConstants.get_Common_Groups, { _id: this.group_id });

        // Retrives previous messages when a chat is scrolled up
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.chat_History_Updation, (res: any) => {
            this.chatArray.unshift.apply(this.chatArray, res.conversations);
            this.showSpinnerForChatHistory(false);
            document.getElementById("_infoOverlay").style.display = "none";
        }));

        // Sends a chat message
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.chat, (res: any) => {
            this.chatDisabled(false);
            const doc: any = document;
            getService.socketioInstance().sendData(socketIOConstants.last_Seen, { text: res.text, _id: res.groupId });

            if (res.created_by_user.user_id === this.current_user.user_id && res.type === chatType.text) {
                const index = this.chatArray().findIndex((val: any) => val.temp_id === res.temp_id);
                if (index !== -1) {
                    this.chatArray().splice(index, 1);
                }
                this.originalFileName("");
                // this.chatText("");
                // doc.getElementById("chatText").value = "";
                document.getElementById("chatText").focus();
            }
            if (!this.isWindowFocused && res.user._id !== this.current_user._id) {
                window.document.title = "Unread Message(s)";
                getService.notificationServiceInstance().notify("You have unread message from " + res.created_by_user.user_name, notificationType.message);
            }

            this.chatArray.push(res);
            const elem = document.getElementById("_chat-history");
            if (elem.scrollHeight - elem.scrollTop <= this.sheight) {
                elem.scrollTop = elem.scrollHeight;
            }

            // Updates the cached chat data
            getService.cacheChatInstance().updateChatCache(res);
        }));

        // Displays ..is typing when other group member is typing
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.typing, (res: any) => {
            if (this.current_user._id !== res._id) {
                this.typingUser(res.user_name);
                this.userTyping(true);
                setTimeout(() => {
                    this.userTyping(false);
                }, 3000);
            }
        }));

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.download, (res: any) => {
            getService.socketioInstance().sendData(socketIOConstants.chat, { type: chatType.doc, text: res.originalFilename, doc_id: res._id, _id: this.group_id });
        }));

        // Deletes a message from a conversation
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.delete_Mess, (res: any) => {
            const index = this.chatArray().findIndex((val: any) => val._id === res);
            if (index !== -1) {
                const obj = this.chatArray()[index];
                obj.isDropped = true;
                this.chatArray.splice(index, 1);
                this.chatArray.splice(index, 0, obj);
            }
            // Updates the cached data when a message is deleted
            getService.cacheChatInstance().updateDelCacheData(this.group_id, res, this.current_user._id);
        }));

        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.ticker, (res: any) => {
            const converse: any = this.conversation();
            if (converse && converse.users) {
                if (converse.users.map(val => val._id).indexOf(res.user._id) !== -1) {
                    if (converse.isP2PChat === true) {
                        this.ticker_userObservable(res.user);
                        this.chat_user_obj(res.user);
                    } else {
                        this.chat_user_obj(res.user);
                    }
                }
            }
        }));

        // Marks a message as favorite
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.mark_favorite, (res: any) => {
            const index = this.chatArray().map((el) => {
                return el._id;
            }).indexOf(res.chat_id);
            if (index > -1) {
                const conversation: any = this.chatArray()[index];
                if (conversation.favorite.indexOf(this.current_user._id) === -1) {
                    conversation.favorite.push(this.current_user._id);
                    this.chatArray.splice(index, 1);
                    this.chatArray.splice(index, 0, conversation);
                }
                // Updates the cached data when a message is marked favorite
                getService.cacheChatInstance().updateFavCacheData(true, res._id, res.chat_id, this.current_user._id);
            }
        }));

        // Unmarks a message from favorites list
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.unmark_favorite, (res: any) => {
            const index = this.chatArray().map((el) => {
                return el._id;
            }).indexOf(res.chat_id);
            if (index > -1) {
                const conversation: any = this.chatArray()[index];
                const userIndex = conversation.favorite.indexOf(this.current_user._id);
                if (userIndex > -1) {
                    conversation.favorite.splice(userIndex, 1);
                    this.chatArray.splice(index, 1);
                    this.chatArray.splice(index, 0, conversation);
                }
                // Updates the cached data when a message is unmarked from favorite
                getService.cacheChatInstance().updateFavCacheData(false, res._id, res.chat_id, this.current_user._id);
            }
        }));

        // Listener to change for users who were already present in the group when a new user is added to the group
        this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.add_User_Change, (res: any) => {
            if (!res.users()) {
                res.users = ko.observableArray(res.users);
            }
            res.users.sort((a: any, b: any) => {
                return (a.online_status - b.online_status || new Date(b.last_online).getTime() - new Date(a.last_online).getTime());
            });
            res.users().filter((val) => {
                const index = this.allUsersArray().findIndex((value: any) => value._id === val._id);
                if (index !== -1) {
                    this.allUsersArray.splice(index, 1);
                }
            });
            this.groupDetails([]);
            this.groupDetails(res.users);
            this.showAddUser(false);
            this.p2p_status(res.isP2PChat);
        }));
    }

    // Displays the searched user
    public searchUsersResults = ko.computed(() => {
        const q = this.Query().toLowerCase();
        return this.allUsersArray().filter((i: any) => {
            if (i.user_name) {
                return i.user_name.toLowerCase().indexOf(q) >= 0;
            } else {
                return false;
            }
        });
    });

    /**
     * Returns all the user(s) who have read a particular message
     * @function readMessages
     * @param data Conversation chat message details
     */
    public readMessages = (data: any) => {
        if (data.group_id && data.chat_id) {
            getService.apiServiceInstance().getData(appConfig.server_url + "/v1/discussion/messages/read/" + data.group_id + "/chat/" + data.chat_id).then((res: any) => {
                this.readMessageUserList(res);
            });
        }
    }

    /**
     * A user can send a message
     * @function onEnter
     * @param d
     * @param e
     */
    public onEnter = (d: any, e: any) => {
        if (e.keyCode === 13) {

            const doc: any = document;
            let chatValue = doc.getElementById("chatText").value;
            if (e.ctrlKey) {
                this.chatText(this.chatText() + "\n");
                return true;
            } else if (/\S/.test(chatValue)) {
                // this.chatDisabled(true);
                chatValue = chatValue.replace(/\n/g, "\n\n");
                const local_chat_msg = chatService.getLocalMessage(chatValue, this.current_user);
                this.chatArray.push(local_chat_msg);
                const elem = document.getElementById("_chat-history");
                elem.scrollTop = elem.scrollHeight;
                if (this.replyOf()) {
                    getService.socketioInstance().sendData(socketIOConstants.chat, { text: chatValue.trim(), type: chatType.text, _id: this.group_id, temp_id: local_chat_msg.temp_id, replyOf: this.replyOf() });
                } else {
                    getService.socketioInstance().sendData(socketIOConstants.chat, { text: chatValue.trim(), type: chatType.text, _id: this.group_id, temp_id: local_chat_msg.temp_id });
                }

                getService.socketioInstance().sendData(socketIOConstants.unread_Messages, { _id: this.group_id });
                // Adds a message to links tab if the meesage is a link
                if (/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm.test(chatValue)) {
                    const textValue: any = chatValue.match(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm);
                    getService.socketioInstance().sendData(socketIOConstants.add_To_Links, { _id: this.group_id, text: textValue });
                }
                this.closeReplyBox();
                this.chatText("");
                doc.getElementById("chatText").value = "";
                return false;
            }
        }
        return true;
    }

    public selectSuggest = (key: string) => {
        const textArr = this.chatText().split(" ");
        textArr[textArr.length - 1] = key.toLowerCase();
        this.chatText(textArr.join(" ") + " ");
        document.getElementById("chatText").focus();
    }

    /**
     * A user can transfer chat to another user.
     * @function transferChat
     */
    public transferChat = () => {
        if (this.TransferUsers().length) {
            getService.socketioInstance().sendData(socketIOConstants.transfer_Chat, { _id: this.group_id, users: this.TransferUsers(), subject: this.conversation().subject });
        } else {
            getService.errorServiceInstance().throwError("Select user to transfer the chat");
        }
    }

    /**
     * Displays the date
     * @function showDate
     * @param date Date
     * @returns Date
     */
    public showDate = (date: any) => {
        const bool = this.tempDate === new Date(date).toLocaleDateString();
        this.tempDate = new Date(date).toLocaleDateString();
        return bool;
    }

    /**
     * A user can send files in a conversation.The method uploadDoc uploads a document
     * @function upload_doc
     * @param data File information to be sent
     */
    public upload_doc = (data: any) => {
        const file = data[0].files[0];
        if (data[0].files.length) {
            data = {
                current_user_Id: this.current_user._id,
                group_id: this.group_id,
            };
            if (this.replyOf()) {
                data.replyOf = this.replyOf();
            }
            // Uploads a document
            chatService.uploadDoc(data, file, (prog: number) => {
                this.progress(prog);
            });

            this.closePopover();
            this.replyOf({});
            this.closeReplyBox();
        } else {
            getService.errorServiceInstance().throwError("Select at least one file");
            return false;
        }
    }

    // urlify(text: string) {
    //     var urlRegex = /(https?:\/\/[^\s]+)/g;
    //     return text.replace(urlRegex, function (url) {
    //         return "<a target="_blank" href="" + url + "">" + url + "</a>";
    //     });
    // }

    /**
     * Returns the preview of the file sent
     * @function previewUrl
     * @returns File name
     */
    public previewUrl = (data: any) => {
        const fileExtensions = data.text.split(".");
        const fileExtension = fileExtensions[fileExtensions.length - 1];
        return appConfig.server_url + "/uploads/" + data.doc_id + "." + fileExtension;
    }

    /**
     * Checks whether an image is valid or not
     * @function isValidImage
     * @param data message information object
     * @returns A  boolean value
     */
    public isValidImage = (data: any) => {
        const fileExtensions = data.text.split(".");
        const fileExtension: string = fileExtensions[fileExtensions.length - 1];
        return getService.utilsInstance().imageExtn.indexOf(fileExtension.toLowerCase()) !== -1;
    }

    /**
     * A user can download a sent file in a conversation. The method downloadDoc downloads a document
     * @function download_doc
     * @param data Document information
     */
    public download_doc = (data: any) => {
        chatService.downloadDoc(data);
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
     * A user can delete a message from a group. The method allows a user to delete a message.
     * @function deleteMessage
     * @param data Details of the message to be deleted
     */
    public deleteMessage = (data: any) => {
        getService.socketioInstance().sendData(socketIOConstants.delete_Mess, { _id: data._id, group_id: this.group_id });
        this.closePopover();
    }

    /**
     * A user can be a part of a group conversation. The method allows user to leave a group.
     * @function leaveGroup
     */
    public leaveGroup = () => {
        getService.socketioInstance().sendData(socketIOConstants.leave_Group, { _id: this.group_id });
    }

    /**
     * The conversation contains various messages. This method allows a user to mark a message as favorite
     * @function markfavorite
     * @param data Message information to be marked as favorite
     */
    public markfavorite = (data: any) => {
        const index = this.chatArray().map((el) => {
            return el._id;
        }).indexOf(data._id);
        if (index > -1) {
            const conversation: any = this.chatArray()[index];
            if (conversation.favorite.indexOf(this.current_user._id) === -1) {
                conversation.favorite.push(this.current_user._id);
                this.chatArray.splice(index, 1);
                this.chatArray.splice(index, 0, conversation);
                getService.socketioInstance().sendData(socketIOConstants.mark_favorite, { group_id: this.group_id, chat_id: data._id, text: conversation.text });
            }
        }
    }

    /**
     * The conversation contains various messages. This method allows a user to unmark a message from favorites
     * @function unmarkfavorite
     * @param data Message information to be umarked from favorite
     */
    public unmarkfavorite = (data: any) => {
        const index = this.chatArray().map((el) => {
            return el._id;
        }).indexOf(data._id);
        if (index > -1) {
            const conversation: any = this.chatArray()[index];
            const userIndex = conversation.favorite.indexOf(this.current_user._id);
            if (userIndex > -1) {
                conversation.favorite.splice(userIndex, 1);
                this.chatArray.splice(index, 1);
                this.chatArray.splice(index, 0, conversation);
                getService.socketioInstance().sendData(socketIOConstants.unmark_favorite, { group_id: this.group_id, chat_id: data._id, text: conversation.text });
            }
        }
    }

    /**A user can reply to a particular message.
     * @function replyToMessage
     * @param data Details of message to whom reply has to be sent
     */
    public replyToMessage = (data: any) => {
        $("._chattingComponent ._chats").css("max-height", "100vh").css("max-height", "-=225px");
        this.showReplyBox(true);
        const index = this.chatArray().map((el) => {
            return el._id;
        }).indexOf(data._id);
        if (index > -1) {
            const conversation: any = this.chatArray()[index];
            this.replyOf({ chat_id: conversation._id, chat_name: conversation.created_by_user.user_name, message: conversation.text });
        }
        $("#chatText").focus();
    }

    /**The conversation group contains various messages. A user can focus over the message that has been replied to using this method.
     * @function goToRepliedMessage
     * @param data details of the replyOf message
     */
    private goToRepliedMessage = (data: any) => {
        const index = this.chatArray().map((el) => {
            return el._id;
        }).indexOf(data.replyOf.chat_id);
        if (index > -1) {
            const conversation: any = this.chatArray()[index];
            this.selectedReplyMessageID(conversation._id);
            const self = this;
            setTimeout(() => {
                self.selectedReplyMessageID("");
            }, 1000);
            const chatTop = $("._chats").offset().top;
            const container = $("._chats");
            const scrollTo = (this._env() === "desktop") ? $(".selectedReplyMessage") : $(".selectedReplyMessage_c");
            container.animate({
                scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
            });
        }
    }

    /**
     * When the user clicks on icon to reply to a message, a replyOf element pops up. This method closes the replyOf element.
     * @function closeReplyBox
     */
    public closeReplyBox = () => {
        $("._chattingComponent ._chats").css("max-height", "100vh").css("max-height", "-=180px");
        this.showReplyBox(false);
        this.replyOf({});
    }

    /**
     * A user can download an entire conversation of a group.
     * @function downloadChats
     */
    public downloadChats = () => {
        chatService.downloadChats({ _id: this.group_id });
    }

    /**
     * Closes popover
     * @function closePopover
     */
    public closePopover = () => {
        $("#myFileField").val("");
        $("#myFileField1").val("");
        const win: any = window;
        win.WebuiPopovers.hideAll();
    }

    /**
     * User details are passed. otherUsersOnlineStatus() returns which class must be applied according to the status of other user if p2p, else applies class for group.
     * @function otherUsersOnlineStatus
     * @returns Status of user if p2p or else a group
     */
    public otherUsersOnlineStatus = () => {
        const user = this.chat_user_obj();
        if (!$.isEmptyObject(user)) {
            if (user.online_status) {
                switch (user.online_status) {
                    case onlineStatus.online: return "_online";
                    case onlineStatus.offline: return "_offline";
                    case onlineStatus.away: return "_away";
                }
            } else {
                return "_group";
            }
        }
    }

    /**
     * Disposes all subscriptions of the controller socket methods
     */
    public dispose() {
        getService.socketioInstance().unsubscribe(this.subscriptions);
        window.removeEventListener("focus", this.ff);
        window.removeEventListener("blur", this.bf);
    }

    private ff: any;
    /**
     * Denotes that the window is focussed
     * @param e any
     */
    public focusFunction(e: any) {
        window.document.title = "ChatElite";
        this.isWindowFocused = true;
    }

    private bf: any;
    /**
     * Denotes that the window is out of focus
     * @param e any
     */
    public blurFunction(e: any) {
        this.isWindowFocused = false;
    }

    /**
     * A user can send emojis in a chat message. When an emoji is clicked, its equivalent text code is set.
     * @function changeEmoji
     * @param data equivalent text code for emoji
     */
    public changeEmoji = (data) => {
        this.chatText(this.chatText() + " " + data.name + " ");
    }
    public attachEvents = () => {
        this.ff = this.focusFunction.bind(this);
        this.bf = this.blurFunction.bind(this);
        window.addEventListener("focus", this.ff);
        window.addEventListener("blur", this.bf);
    }

    /**
     * The application is available in 2 views - expanded view and collapsed view. collapse_chat toggles chat component in collapsed view.
     * @function collapse_chat
     */
    public collapse_chat = () => {
        $("._chattingComponent_c,._chatting_header_c").slideToggle(1000, () => {
            $("._chat_collapse_action_c").text(() => {
                $("._chattingComponent_c").is(":visible") ? ($("._chat_collapse_action_c").attr("title", "Collapse")) : ($("._chat_collapse_action_c").attr("title", "Expand"));
                return $("._chattingComponent_c").is(":visible") ? "arrow_drop_down" : "arrow_drop_up";
            });
        });
    }

    /**
     * Closes a chat component in collapsed view.
     * @function close_chat
     */
    public close_chat = () => {
        $(".__chatComponent_c").hide();
    }

    /**
     * The application is available in 2 views - expanded view and collapsed view. collapsed_widget method changes the application from expanded view to collapsed view.
     * @function collapsed_widget
     */
    public collapsed_widget = (data: any) => {
        localStorage.setItem("__collab_env", "collapsed");
        location.reload();
    }

    /**
     * A user can search for particular word in his chats. The method displays search box for searching keywords from the conversation.
     * @function searchingChats
     */
    public searchingChats = () => {
        this.searchChats(true);
    }

    /**
     * A user can search for particular word in his chats. The method allows the user to cancel a search for keyword from the conversation.
     * @function cancelSearch
     */
    public cancelSearch = () => {
        this.searchChats(false);
        this.searchChatText("");
        const elem = document.getElementById("_chat-history");
        elem.scrollTop = elem.scrollHeight;
    }

    /**
     * A user can search for particular word in his chats. The method allows a user to clear the search keyword from search box.
     * @function clearSearchChatText
     */
    public clearSearchChatText = () => {
        this.searchChatText("");
        const elem = document.getElementById("_chat-history");
        elem.scrollTop = elem.scrollHeight;
    }

    /**
     * Searches a keyword from all chat messages.
     */
    public searchChatsFromHist = ko.computed(() => {
        const searchChat = this.searchChatText().toLowerCase();
        if (searchChat) {
            return this.chatArray().filter((i: any) => {
                return i.text.toLowerCase().indexOf(searchChat) >= 0;
            });
        } else {
            return this.chatArray();
        }
    });

    /**
     * A user can search the conversation for a particular chat.
     * @function doChatSearch
     */
    public doChatSearch = (e: any) => {
        const searchChat = this.searchChatText().toLowerCase();
        if (searchChat && e.keyCode === 13) {
            this.searchChatsFromHist();
            return true;
        } else { return true; }
    }

    /**
     * A user can be a part of the group. He can add users to that group. When a user clicks on 'add users to group icon', the method displays a popover modal containing list of users to be added to the group.
     * @function showAddUserToGroup
     */
    public showAddUserToGroup = () => {
        const win: any = window;
        win.WebuiPopovers.hideAll();
        this.showAddUser(true);
        // this.addGroupUsers([]);
    }

    /**
     * A user can be a part of the group. He can add users to that group.
     * @function addUserToGroup
     */
    public addUserToGroup = () => {
        if (this.group_id && this.addGroupUsers().length) {
            getService.socketioInstance().sendData(socketIOConstants.add_User, { _id: this.group_id, users: this.addGroupUsers() });
            this.showAddUser(false);
        } else {
            getService.errorServiceInstance().throwError("Select at least one user");
        }
        this.addGroupUsers([]);
    }

    /**
     * A user can be a part of the group. He can add users to that group. When a user clicks on 'add users to group icon', a popover modal containing list of users to be added to the group is displayed. The method allows a user to close that popover modal.
     * @function closeAddUserToGroup
     * @description Closes panel to add users to a group
     */
    public closeAddUserToGroup = () => {
        this.showAddUser(false);
        this.addGroupUsers([]);
    }

    /**
     * @constructor
     * @param params ID of the conversation group
     */
    constructor(params: any) {
        this.chatText.subscribe((val) => {
            if (val.trim() === "") {
                this.suggestText([]);
            } else {
                // Whenever a user is typing in the text box, this api is called
                getService.socketioInstance().sendData(socketIOConstants.typing, { _id: this.group_id });
                // let textArr = val.split(" ");
                // let lastWord = textArr.slice(-1)[0];
                // if (lastWord.length >= 3 && /^[A-Z]+$/i.test(lastWord)) {
                //     getService.apiServiceInstance().getData(appConfig.server_url + "/v1/discussion/suggest/" + lastWord)
                //         .then((res) => {
                //             this.suggestText.removeAll();
                //             this.suggestText.push.apply(this.suggestText, res)
                //         });
                // }
            }
        });
        this.replyOf({});
        this.group_id = params.group_id();
        this.attachEvents();
        getService.chatGroupServiceInstance().setGroupId(this.group_id);
        this.init();
        const elem = document.getElementById("_chat-history");
        setTimeout(() => {
            // scrolls upto the bottom of chat screen
            const event = new CustomEvent("_scroll-now", { detail: "" });
            elem.dispatchEvent(event);
        }, 1000);
        this.pageNo = 1;
        if (elem) {
            elem.onscroll = () => {
                if (elem.scrollTop < 20) {
                    if (this.pageNo * 20 < this.chatTotalCount) {
                        this.showSpinnerForChatHistory(true);
                        // get previous messages when chat is scrolled up
                        getService.socketioInstance().sendData(socketIOConstants.chat_History_Updation, { _id: this.group_id, pageNo: this.pageNo, chatTotalCount: this.chatTotalCount });
                        this.pageNo++;
                        document.getElementById("_infoOverlay").style.display = "block";
                    }
                }
            };
        }
        $(document).off(event_listeners.cacheChat);
        // caches the chat messages of a conversation group
        $(document).on(event_listeners.cacheChat, (e: any) => {
            this.chatTotalCount = e.detail.chatTotalCount;
            try {
                const lastMessageId = e.detail.conversations[e.detail.conversations.length - 1]._id;
                // updates the chat array if a new message is sent
                if (this.chatArray()[this.chatArray().length - 1]._id !== lastMessageId) {
                    this.chatArray([]);
                    this.chatArray.push.apply(this.chatArray, e.detail.conversations);
                    this.showSpinnerForChatHistory(false);
                }
            } catch (ex) {
                this.chatArray([]);
                this.chatArray.push.apply(this.chatArray, e.detail.conversations);
                this.showSpinnerForChatHistory(false);
            }
            // Joins a user socket to a particular group
            getService.socketioInstance().joinGroup(this.group_id);

            setTimeout(() => {
                const elem = document.getElementById("_chat-history");
                elem.scrollTop = elem.scrollHeight;
                this.sheight = elem.scrollHeight - elem.scrollTop + 150;
            });
        });

        // Caches chat data to storageDB
        getService.cacheChatInstance().cacheChatHistory(this.group_id);
    }
}
