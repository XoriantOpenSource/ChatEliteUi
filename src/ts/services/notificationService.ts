/*!
 * HTML5-Desktop-Notifications v3.0.0
 * Copyright 2016 Tsvetan Tsvetkov
 * Licensed under MIT (https://github.com/ttsvetko/HTML5-Desktop-Notifications/blob/master/License.txt)
!*/
import "html5-notification/dist/Notification";
import getService from "./getService";

/**
 * @class
 * @classdesc Consists of notification related methods
 */
export default class notificationService {

    private win: any = window;
    private isWindowFocused = true;
    private notifiStack: Array<any> = [];

    private init() {
        // Action when browser window is in focus
        window.addEventListener("focus", () => {
            this.notifiStack.forEach((val) => val.close());
            this.notifiStack = [];
            this.isWindowFocused = true;
        });

        // Action when browser window is out of focus
        window.addEventListener("blur", () => {
            this.isWindowFocused = false;
        });
        // Actions on browser permissions to display notifications or not
        switch (this.win.Notification.permission) {
            case "default":
                this.win.Notification.requestPermission().then((res: any) => {
                    this.win.Notification("ChatElite Notification Enabled", {
                        icon: "https://cdn0.iconfinder.com/data/icons/basic-ui-elements-colored/700/09_bell-3-512.png"
                    });
                });
                break;

            case "denied":
                getService.errorServiceInstance().throwInfo("Please enable notifications for real time updates.");
                break;

        }
    }
    /**
     * @function notify
     * @param message the notification message text
     * @param type the type of notification whether online or text message
     * @param ico the notification message icon
     * @param data conversation group information
     * @description Notifies a user
     */
    public notify(message: string, type: string, ico: string = "https://cdn0.iconfinder.com/data/icons/basic-ui-elements-colored/700/09_bell-3-512.png", data?: string) {
        if (!this.isWindowFocused) {
            const tempNotify = this.win.Notification("ChatElite Notification", {
                data: data,
                body: message,
                icon: ico,
                tag: type
            });
            // user clicks on a notification he is directed to the conversation window of the notification sender
            tempNotify.onclick = (e: any) => {
                window.focus();
                if (e.target.data && e.target.data.length > 0) {
                    const event = new CustomEvent("_showChatComponent", { detail: e.target.data });
                    document.body.dispatchEvent(event);
                }
            };
            this.notifiStack.push(tempNotify);
        }
    }
    /**
     * @constructor
     */
    constructor() {
        this.init();
    }
}
