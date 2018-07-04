import boot from "./bootUp";
import { appConfig } from "../configs/appConfig";
appConfig.env = localStorage.getItem("__collab_env") || "desktop";
// appConfig.env = "collapsed";
import getService from "../services/getService";
import inject from "./injectScripts";

declare global {
    interface Array<T> {
        findIndex(predicate: any): number;
        find(predicate: any): any;

    }
}

const win: any = window;

/**
 * Configuration object for collab
 */
win.__collab_config = {
    server_url: "https://localhost:1234",
    user_details_url: "https://localhost:1234/v1/user",
    debug_mode: 5, // 5 for debug
    demo_mode: true,
    user_details_sign: {
        id: "user_id",
        name: "user_name",
        img: "profile_img",
        grade: "grade"
    }
};

/**
 * Requires the directories
 */
function requireAll(r: any) {
    r.keys().forEach(r);
}
// register all the controllers for the application
requireAll(require.context("../app", true, /.controller.ts/));
requireAll(require.context("../app", true, /.binding.ts/));

win.__collab_init = (value?: any) => {

    if (value) {
        // send session value
        if (typeof value === "string") {
            win.__collab_config.session_header.value = value;
        } else if (typeof value === "object") {
            // user details is directly send
            appConfig.user_details = value;
        }
    }

    if (win.__collab_config) {

        const temp: any = appConfig;
        for (const prop in win.__collab_config) {
            temp[prop] = win.__collab_config[prop];
        }

        // inject required scripts
        new inject().inject().then(() => {
            // Boot up the application
            const a = new boot();
        });
    } else {
        throw new Error("Configurations not found");
    }
    getService.loggerInstance().debug("in app.ts");
};

win.__collab_init();
