import getService from "./getService";
import { socketIOConstants } from "../configs/constants";
import { appConfig } from "../configs/appConfig";
/**
 * @class
 * @classdesc Consists of user specific methods
 */
export default class userService {

    public logout() {
        getService.socketioInstance().sendData(socketIOConstants.logout);
        // getService.socketioInstance().subscribe(socketIOConstants.logout, () => {
        //     getService.socketioInstance().sendData(socketIOConstants.ticker, { online_status: online_status.offline });
        // });
    }
    /**
     * @function getUserDetails
     * @description Fetches the user details
     */
    public async getUserDetails() {

        let user: any;
        if (appConfig.user_details_url && !appConfig.user_details) {
            user = await getService.apiServiceInstance().getData(appConfig.user_details_url, [{
                key: appConfig.session_header.key,
                value: appConfig.session_header.value
            }]);
            this.mapUserToConfig(user);
        }

        await this.joinSocketUser();
    }

    /**
     * @function mapUserToConfig
     * @param user User details
     * @description Maps the user details to appconfig
     */
    public mapUserToConfig(user: any) {

        const win: any = window;
        for (const usr in win.__collab_config.user_details_sign) {
            appConfig.user_details[win.__collab_config.user_details_sign[usr]] = user[win.__collab_config.user_details_sign[usr]];
        }

    }

    public async loginManual(user: any) {
        this.mapUserToConfig(user);
        await this.joinSocketUser();
    }

    /**
     * @function joinSocketUser
     * @description Allows a user socket to join the channel
     */
    public async joinSocketUser() {
        await getService.socketioInstance().joinUser();
    }

}
