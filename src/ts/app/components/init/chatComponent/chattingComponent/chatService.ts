import getService from "../../../../../services/getService";
import { socketIOConstants } from "../../../../../configs/constants";
import { appConfig } from "../../../../../configs/appConfig";
import { chatType } from "../../../../../configs/enums";
const uuid = require("uuid/v4");

/**
 * @class
 * @classdesc Contains methods used in chat component for various activities.
 */
export default class chatService {
    public static pos: any = "";

    /**
     * A user can send files in a conversation. The method uploadDoc uploads a document.
     * @function uploadDoc
     * @param data Data regarding sender, group
     * @param file File information to be uploaded
     * @param progress progress status
     */
    public static uploadDoc(data: any, file: any, progress: any) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.onreadystatechange = (res: any) => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response: any = JSON.parse(res.target.response);
                    if (data.replyOf) {
                        getService.socketioInstance().sendData(socketIOConstants.chat, { type: chatType.doc, text: response.originalFilename, doc_id: response._id, _id: response.group_id, replyOf: data.replyOf });
                    } else {
                        getService.socketioInstance().sendData(socketIOConstants.chat, { type: chatType.doc, text: response.originalFilename, doc_id: response._id, _id: response.group_id });
                    }
                } else if (xhr.status === 412) {
                    getService.errorServiceInstance().throwError(JSON.parse(res.target.response).server_message);
                }
                let d: any = document.getElementById("myFileField");
                d.value = "";
                d = document.getElementById("myFileField1");
                d.value = "";
            }
        };

        if (xhr.upload) {
            xhr.upload.onprogress = (evt) => {
                const prog = Math.round(evt.loaded / evt.total * 100) + "%";
                progress(prog);
            };
        }

        formData.append("file", file);
        formData.append("currentUserId", data.current_user_Id);
        formData.append("group_id", data.group_id);
        xhr.open("POST", appConfig.server_url + "/v1/discussion/files/upload");

        if (appConfig.user_token) {
            const x = appConfig.user_token;
            xhr.setRequestHeader("x-access-token", appConfig.user_token);
        }

        xhr.send(formData);

    }

    /**
     * A user can download a sent file in a conversation. The method downloadDoc downloads a document.
     * @function downloadDoc
     * @param data Downloads a document
     * @description Download a recieved file
     */
    public static downloadDoc(data: any) {
        const params = data.doc_id;
        window.open(appConfig.server_url + "/v1/discussion/files/download" + "/" + params);
    }

    /**
     * A user can download an entire conversation of a group.
     * @function downloadChats
     * @param data ID of the conversation group whose chat is to be downloaded
     */
    public static downloadChats(data: any) {
        const params = data._id;
        const win = window.open(appConfig.server_url + "/v1/discussion/files/download/chat" + "/" + params);
        setTimeout(function () {
            win.close();
            getService.errorServiceInstance().throwInfo("Download Successful!");
        }, 3000);
    }

    public static changeSubject(value: any, group_id: any) {
        const changedSubject: string = value.trim();
        if (changedSubject.length < 3) {
            getService.errorServiceInstance().throwError("Enter minimum 3 characters!");
        } else {
            getService.socketioInstance().sendData(socketIOConstants.change_Group_Subject, { _id: group_id, subject: changedSubject });
        }
    }
    /**
     * Create a temporary message until response for socket "chat" arrives.
     * @function getLocalMessage
     * @param chatValue chat message value
     * @param user User details
     * @returns An object
     */
    public static getLocalMessage(chatValue: any, user: any) {
        const temp_uid = uuid();
        const local_chat_msg = {
            created_by_user: user, created_date_time: new Date().toISOString(), favorite: [],
            isDropped: false, readBy: [], text: chatValue.trim(), type: chatType.text,
            _id: "", temp_id: temp_uid, local: true
        };
        return local_chat_msg;
    }
}
