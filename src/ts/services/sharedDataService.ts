import getService from "../services/getService";
import { appConfig } from "../configs/appConfig";

/**
 * @class
 * @classdesc Contains data which is used over different components
 */
export default class sharedDataService {

    private gradeSettings: any;
    private loggedInUsers: any;

    /**
     * @returns user grade
     * @description Returns a user grade
     */
    get gradeSetting() {
        return this.gradeSettings;
    }

    /**
     * @param data A string
     * @description Sets the grade value
     */
    set gradeSetting(data) {
        this.gradeSettings = data;
    }
    get allUsersfromDb() {
        return this.loggedInUsers;
    }

    public init() {
        // get all users from DB
        getService.apiServiceInstance().getData(appConfig.server_url + "/v1/user/allUsersFromDb").then((res: any) => {
            if (res) {
                this.loggedInUsers = res;
                const allUsersFromDbEvent: any = new CustomEvent("allUsersFromDbEvent", { detail: res });
                document.body.dispatchEvent(allUsersFromDbEvent);
            }
        });
    }
    constructor() {
    }
}
