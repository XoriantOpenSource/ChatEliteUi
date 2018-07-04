import getService from "../../../../services/getService";
import { socketIOConstants } from "../../../../configs/constants";
import { appConfig } from "../../../../configs/appConfig";
import { platform, os } from "../../../../configs/enums";

export default class notifyService {
    /**
     * Checks if service workers are supported for push notifications.
     */
    public static initializeNotify() {
        if (navigator && navigator.serviceWorker) {
            const win: any = window;
            win.firebase.initializeApp(appConfig.firebase_config_for_web);
            const messaging = win.firebase.messaging();
            navigator.serviceWorker.register("./firebase-messaging-sw.js").then((registration) => {
                messaging.useServiceWorker(registration);
                messaging.requestPermission().then(() => {
                    return messaging.getToken();
                }).then((token) => {
                    // save user specific token for sending push notifications
                    getService.apiServiceInstance().postData(appConfig.server_url + "/v1/user/deviceInfo", { device_id: token, platform: platform.web, os: os[win.webrtcDetectedBrowser] });
                }).catch((err) => {
                });
            }).catch((e) => {
            });
            // whenever a notification arrives,any customization for data to be displayed can be done here
            messaging.onMessage((payload) => {
            });

            // when user specific token refreshes, update the database
            messaging.onTokenRefresh(() => {
                messaging.getToken().then((refreshedToken) => {
                    getService.apiServiceInstance().postData(appConfig.server_url + "/v1/user/deviceInfo", { device_id: refreshedToken, platform: platform.web, os: os[win.webrtcDetectedBrowser] });
                });
            });
        }
    }
}
