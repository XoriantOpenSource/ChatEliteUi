import { appConfig } from "../configs/appConfig";
import { socketIOConstants } from "../configs/constants";
import getService from "./getService";

import * as io from "socket.io-client";
import sharedDataService from "./sharedDataService";
/**
 * @class
 * @classdesc Consists of socket related methods
 */
export default class socketio {

    private socket = io(appConfig.server_url, {
        transports: ["websocket"]
    });

    private socketRespones: Array<any> = [];

    /**
     * Disconnects the socket from the group
     */
    public disconnectSocket() {
        this.leaveGroup(getService.chatGroupServiceInstance().getGroupId());
        this.socket.disconnect();
    }
    /**
     * @function registerSocketIoResponse
     * @description Various socket events for connection
     */
    private registerSocketIoResponse() {

        this.socket.on("connect_failed", () => {
            getService.errorServiceInstance().throwError("Connection to the server is lost. please try refreshing the page");
        });

        this.socket.on("error", () => {
            getService.errorServiceInstance().throwError();
        });

        this.socket.on("reconnecting", () => {
            getService.errorServiceInstance().throwError("Connection to the server is lost.Trying to reconnect...");
        });

        this.socket.on("reconnect_failed", () => {
            getService.errorServiceInstance().throwError("Re-Connection to the server is lost. please try refreshing the page");
        });

        this.socket.on("reconnect_attempt", () => {
            this.socket.io.opts.transports = ["polling", "websocket"];
        });

        this.socket.on("reconnect", () => {
            getService.apiServiceInstance().postData(appConfig.server_url + "/v1/user/rejoin", { socket_id: this.socket.id }).then(() => {
                location.reload();
            }, () => {
                location.reload();
            });
        });

        this.socket.on("channel", (response: any) => {
            getService.loggerInstance().info(`socket recieved for type ${response.type} with data : ${JSON.stringify(response.data)}`);
            for (const x of this.socketRespones.filter((val: any) => val.type === response.type)) {
                x.cb(response.data);
            }
        });
    }

    public subscribe(type: string, callback: any) {
        const randId = getService.utilsInstance().randomNumber();
        this.socketRespones.push({
            id: randId,
            type: type,
            cb: callback
        });
        return randId;
    }

    public unsubscribe(ids: Array<number> | any) {
        if (!ids.length) {
            this.socketRespones.splice(this.socketRespones.findIndex((val: any) => val.id === ids), 1);
        } else {
            for (const data of ids) {
                this.socketRespones.splice(this.socketRespones.findIndex((val: any) => val.id === data), 1);
            }
        }
    }

    /**
     * @function getData
     * @param type type of socket api request(a string)
     * @param data Data to be sent
     * @returns A Promise object
     * @description Gets data via socket api requests
     */
    public getData(type: string, data?: any) {

        return new Promise((resolve: any, reject: any) => {
            if (!data) {
                data = {};
            }
            const win: any = window;

            data.user = appConfig.user_details;
            data.user_token = appConfig.user_token;
            getService.loggerInstance().info(`Socket emit type: ${type} with data : ${JSON.stringify(data)}`);
            switch (type) {
                case socketIOConstants.conversation:
                    this.socket.emit(socketIOConstants.conversation, data);
                    this.subscribe(socketIOConstants.conversation, resolve);
                    break;

                case socketIOConstants.chat_history:
                    this.socket.emit(socketIOConstants.chat_history, data);
                    this.subscribe(socketIOConstants.chat_history, resolve);
                    break;

                case socketIOConstants.chat_User:
                    this.socket.emit(socketIOConstants.chat_User, data);
                    this.subscribe(socketIOConstants.chat_User, resolve);
                    break;

                case socketIOConstants.all_Users:
                    this.socket.emit(socketIOConstants.all_Users, data);
                    this.subscribe(socketIOConstants.all_Users, resolve);
                    break;

                case socketIOConstants.all_Users_Chat_Transfer:
                    this.socket.emit(socketIOConstants.all_Users_Chat_Transfer, data);
                    this.subscribe(socketIOConstants.all_Users_Chat_Transfer, resolve);
                    break;

                case socketIOConstants.ticker_all_Users:
                    this.socket.emit(socketIOConstants.ticker_all_Users, data);
                    this.subscribe(socketIOConstants.ticker_all_Users, resolve);
                    break;
            }

        });
    }

    /**
     * @function joinGroup
     * @param group_id Conversation group ID
     * @description Socket joins a group.
     */
    public joinGroup(group_id: string) {
        this.socket.emit("join", { token: group_id });
    }

    /**
     * @function leaveGroup
     * @param group_id Conversation group ID
     * @description Socket leaves a group.
     */
    public leaveGroup(group_id: string) {
        this.socket.emit("leave_Group", { token: group_id });
    }

    /**
     * @function sendData
     * @param type Type of socket (a string value)
     * @param data Data to be sent to socket api
     * @description Make a socket api request.
     */
    public sendData(type: string, data?: any) {

        const win: any = window;

        if (!data) {
            data = {};
        }

        data.user = appConfig.user_details;
        data.user_token = appConfig.user_token;
        this.socket.emit(type, data);
        if (data && data.sdp) {
            delete data.sdp;
        }
        getService.loggerInstance().info(`Socket emit type: ${type} with data : ${JSON.stringify(data)}`);

    }

    /**
     * @function joinUser
     * @description Allows a user socket to join the room
     */
    public joinUser() {
        return getService.apiServiceInstance().postData(appConfig.server_url + "/v1/user/authenticate", { token: appConfig.user_details.res }).then((res: any) => {
            appConfig.user_token = res.token;
            appConfig.user_details = res.user;
            getService.sharedDataServiceInstance().init();
            return getService.apiServiceInstance().getData(appConfig.server_url + "/v1/user/appConfig").then((res: any) => {
                getService.sharedDataServiceInstance().gradeSetting = res.gradeSettings;
                return new Promise((resolve: any, reject: any) => {
                    this.subscribe(socketIOConstants.user_joined, (res: any) => {
                        appConfig.user_details = res;
                        resolve();
                    });

                    this.sendData(socketIOConstants.user_joined);
                });
            });
        });
    }

    constructor() {
        this.registerSocketIoResponse();
    }
}
