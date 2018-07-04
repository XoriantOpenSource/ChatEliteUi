/**
 * @class
 * @classdesc Displays error or success messages
 */
export default class errorService {

    /**
     * @function throwInfo
     * @param message A string message
     * @description Displays successful activity messages
     */
    public throwInfo(message: string) {
        const event = new CustomEvent("info", { detail: message });
        document.body.dispatchEvent(event);
    }

    /**
     * @function throwError
     * @param message  A string message
     * @description Displays error messages
     */
    public throwError(message: string = "something went wrong,please try refreshing the page.") {
        const event = new CustomEvent("error", { detail: message });
        document.body.dispatchEvent(event);
    }

    constructor() {

    }
}
