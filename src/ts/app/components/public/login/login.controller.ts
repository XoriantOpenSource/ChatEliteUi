import { appConfig } from "../../../../configs/appConfig";
const loginTemplate = require(`./main.html`);
import { component } from "../../../../decorators/component";
import getService from "../../../../services/getService";

import * as ko from "knockout";
import { Constants } from "../../../../configs/constants";

// Registers loginComponent as component into knockout
@component({
    name: "loginComponent",
    template: loginTemplate
})

/**
 * @class
 * @classdesc Consists logic for login component
 */
class loginController {

    private _env = ko.observable(appConfig.env);
    private login_user_username = ko.observable();
    private login_user_password = ko.observable();
    private register_user_username = ko.observable();
    private register_user_password = ko.observable();
    private register_user_grade = ko.observable();

    /**
     * @function login
     * @description Login to the application in debug mode
     */
    public login = () => {
        const data = {
            user_name: this.login_user_username(),
            password: this.login_user_password()
        };
        getService.apiServiceInstance().postData(appConfig.user_details_url + Constants.LOGINURL, data).then((user) => {
            getService.userServiceInstance().loginManual(user).then(() => {
                this.cleanup();
            });
        });
    }

    /**
     * @function register
     * @description Registers a new user
     */
    public register = () => {
        const data = {
            user_name: this.register_user_username(),
            password: this.register_user_password(),
            grade: this.register_user_grade()
        };
        getService.apiServiceInstance().postData(appConfig.user_details_url + Constants.REGISTERURL, data).then((user) => {
            getService.userServiceInstance().loginManual(user).then(() => {
                this.cleanup();
            });

        });
    }

    /**
     * @function cleanup
     * @description Removes login component and renders the application UI
     */
    public cleanup() {
        const classelem: any = document.getElementsByClassName("__collab_init");
        classelem[0].style.position = "relative";
        const elem: any = document.getElementsByTagName("login-component");
        elem[0].parentNode.removeChild(elem[0]);

    }
}
