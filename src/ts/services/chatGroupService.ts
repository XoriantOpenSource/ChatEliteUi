import getService from "../services/getService";
import { appConfig } from "../configs/appConfig";

/**
 * @class
 * @classdesc Consists of logic for interactions done in a conversation
 */
export default class chatGroupService {

    private group_id: string;
    private read_chats: Array<any> = [];
    private myGroupUsers: Array<any> = [];
    private isWindowFocused: boolean = true;

    /**
     * @function getGroupId
     * @returns Conversation Group id
     */
    public getGroupId() {
        return this.group_id;
    }

    /**
     * @function setGroupId
     * @param _id A string
     * @description Sets the conversation group id
     */
    public setGroupId(_id: any) {
        this.group_id = _id;
    }

    /**
     * @function setReadChats
     * @param group_id Conversation Group id
     * @param chat_id Message id to be set as read
     * @description Sets a particular message as read
     */
    public setReadChats(group_id: any, chat_id: any) {
        const index = this.read_chats.findIndex((val: any) => val.group_id === group_id);
        if (index > -1) {
            const conversation = this.read_chats[index].conversations.filter((val: any) => val.chat_id === chat_id)[0];
            if (!conversation) {
                this.read_chats[index].conversations.push({ chat_id: chat_id, date_time: new Date().toISOString() });
            }
        } else {
            if (chat_id) {
                const d = {
                    group_id: group_id,
                    conversations: [
                        {
                            chat_id: chat_id,
                            read_date: new Date().toISOString()
                        }
                    ]
                };
                this.read_chats.push(d);
            }
        }
    }

    /**
     * Periodically sets messages as read
     */
    public doScheduling() {
        if (this.read_chats.length > 0 && this.isWindowFocused) {
            const arr = this.read_chats.slice(0);
            this.read_chats = [];
            // Sets an array of messages as read
            getService.apiServiceInstance().postData(appConfig.server_url + "/v1/discussion/readmessages", arr).then(this.doScheduling.bind(this), this.doScheduling.bind(this));
        } else {
            setTimeout(this.doScheduling.bind(this), 5000);
        }
    }

    /**
     * @constructor
     */
    constructor() {
        this.doScheduling();
        window.addEventListener("focus", () => {
            this.isWindowFocused = true;
        });

        window.addEventListener("blur", () => {
            this.isWindowFocused = false;
        });
    }
}
