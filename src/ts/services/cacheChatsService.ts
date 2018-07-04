import getService from "./getService";
import { socketIOConstants } from "../configs/constants";
import { appConfig } from "../configs/appConfig";
const store = require("store");
const operations = require("store/plugins/operations");
store.addPlugin(operations);

/**
 * @class
 * @classdesc Consists of interaction methods of the cached conversations of a user
 */
export default class cacheChatsService {

    private subscriptions: Array<any> = [];
    /**
     * Caches the chat history
     * @function cacheChatHistory
     * @param group_id ID of the group conversation
     */
    public cacheChatHistory = (group_id: any) => {
        if (group_id) {
            if (this.getCachedData(group_id)) {
                const event = new CustomEvent("cacheChat", { detail: this.getCachedData(group_id)[0] });
                document.dispatchEvent(event);
            }
            this.getDatafromServer(group_id);
        }
    }

    /**
     * Gets chats for a particular conversation from the back-end
     * @function getDatafromServer
     * @param group_id ID of the group conversation
     */
    public getDatafromServer = (group_id) => {
        if (group_id) {
            getService.socketioInstance().getData(socketIOConstants.chat_history, { _id: group_id }).then((res: any) => {
                this.setCachedData(group_id, []);
                this.pushCachedData(group_id, res);
                const event = new CustomEvent("cacheChat", { detail: res });
                document.dispatchEvent(event);
                document.getElementById("_infoOverlay").style.display = "none";
            });
        }
    }

    /**
     * Updates the cached chat history data
     * @function updateChatCache
     * @param data Message Data to be updated when a new message is received
     */
    public updateChatCache(data) {
        if (data) {
            const chats = store.get(data.groupId);
            if (chats && chats[0] && (chats === chats[0])) {
                if (!chats.conversations) {
                    chats.conversations = [];
                }
                chats.conversations.push(data);
                if (chats.conversations.length > 20) {
                    chats.conversations.splice(0, chats.conversations.length - 20);
                }
                this.setCachedData(data.groupId, []);
                this.pushCachedData(data.groupId, chats);
            }
        }
    }

    /**
     * Returns cached data for conversations
     * @function getCachedData
     * @param group_id
     * @returns Cached data
     */
    public getCachedData = (group_id: any) => {
        if (group_id) {
            return store.get(group_id);
        }
    }

    /**
     * Sets the messages from each group to its corresponding group chats into the cache
     * @function setCachedData
     * @param group_id
     */
    public setCachedData = (group_id: any, data: any) => {
        if (group_id && data) {
            store.set(group_id, data);
        }
    }

    /**
     * Pushes cached data to storage
     * @function pushCachedData
     * @param group_id
     */
    public pushCachedData = (group_id, data: any) => {
        if (group_id && data) {
            store.push(group_id, data);
        }
    }
    /**
     * Caches history api data
     * @function cacheHistory
     * @param data user_id of requestor
     */
    public cacheHistory = (data: any) => {
        if (data && this.getCachedData(data)) {
            const res: any = this.getCachedData(data)[0];
            const event = new CustomEvent("cacheHistory", { detail: res });
            document.dispatchEvent(event);
        }
        this.getHistoryDatafromServer(data);
    }

    /**
     * Gets all conversation groups of a particular user from the backend
     * @function getHistoryDatafromServer
     * @param data user_id of requestor
     */
    public getHistoryDatafromServer = (data: any) => {
        // Get all conversation details of an user
        if (data) {
            getService.socketioInstance().sendData(socketIOConstants.history);
            this.subscriptions.push(getService.socketioInstance().subscribe(socketIOConstants.history, (r: any) => {
                const res: any = r;
                this.setCachedData(data, []);
                this.pushCachedData(data, res);
                const event = new CustomEvent("cacheHistory", { detail: res });
                document.dispatchEvent(event);
            }));
        }
    }

    /**
     * Updates cached data when a message is marked as favorite or unfavorite
     * @function updateFavCacheData
     * @param markfav true when message is favorited, otherwise false
     * @param group_id ID of the group conversation
     * @param chat_id ID of the message to be marked or unmarked
     * @param user_id User_id of the requestor
     */
    public updateFavCacheData = (markfav: any, group_id: any, chat_id: any, user_id: any) => {
        if (markfav && group_id && chat_id && user_id) {
            const data: any = store.get(group_id);
            const index = data[0].conversations.map((e) => {
                return e._id;
            }).indexOf(chat_id);
            const chat = data[0].conversations[index];
            if (chat) {
                if (!markfav) {
                    const u: any = chat.favorite.indexOf(user_id);
                    if (u > -1) {
                        chat.favorite.splice(u, 1);
                    } else { return; }
                } else {
                    chat.favorite.push(user_id);
                }
                data[0].conversations.splice(index, 1);
                data[0].conversations.splice(index, 0, chat);
                this.setCachedData(group_id, []);
                this.pushCachedData(group_id, data);
            }
        }
    }

    /**
     * Updates the cached data when a message is deleted
     * @function updateDelCacheData
     * @param group_id ID of the group conversation
     * @param chat_id ID of the message to be deleted
     * @param user_id User_id of the requestor
     */
    public updateDelCacheData = (group_id: any, chat_id: any, user_id: any) => {
        if (group_id && chat_id && user_id) {
            const data: any = store.get(group_id);
            const index = data[0].conversations.map((e) => {
                return e._id;
            }).indexOf(chat_id);
            const chat = data[0].conversations[index];
            if (chat) {
                chat.isDropped = true;
                data[0].conversations.splice(index, 1);
                data[0].conversations.splice(index, 0, chat);
                this.setCachedData(group_id, []);
                this.pushCachedData(group_id, data);
            }
        }
    }
}
