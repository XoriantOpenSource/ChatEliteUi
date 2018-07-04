import getService from "./getService";
import { appConfig } from "../configs/appConfig";

/**
 * @class
 * @classdesc Handles all methods for REST api calls
 */
export default class apiService {
    /**
     * @function setXHR
     * @param method the type of REST method
     * @param url url to be hit
     * @param headers headers for the request
     * @param content_type Content-type for the request
     * @param resolve a promise object
     * @param reject a promise object
     * @returns a promise object
     * @description Sets XHR Object
     */
    public static setXHR(method: string, url: any, headers: any, content_type: string, resolve: any, reject: any): XMLHttpRequest {

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(method, url, true);

        if (headers) {
            for (const header of headers) {
                xmlhttp.setRequestHeader(header.key, header.value);
            }
        }

        if (content_type) {

            if (appConfig.user_token) {
                xmlhttp.setRequestHeader("x-access-token", appConfig.user_token);
            }

            xmlhttp.setRequestHeader("Content-type", content_type);
        }

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status === 200) {
                    getService.loggerInstance().info(`Api response received for url: ${url} : with data  ${xmlhttp.responseText}`);
                    if (content_type === "application/json") {
                        resolve(JSON.parse(xmlhttp.responseText));
                    } else {
                        resolve(xmlhttp.responseText);
                    }
                } else if (xmlhttp.status === 401) {
                    window.location.reload();
                } else {
                    getService.loggerInstance().error(`Api response error for url: ${url} : with status text  ${xmlhttp.statusText}`);
                    // getService.errorServiceInstance().throwError();
                    reject({ message: xmlhttp.statusText });
                }
            }

        };

        return xmlhttp;

    }

    /**
     * @function getDataRaw
     * @param url url to be hit
     * @param headers headers for the request if any
     * @description  GET request for data in raw form
     */
    public static getDataRaw<T>(url: string, headers?: Array<collab.utils.IRequestHeader>): Promise<T> {

        return new Promise((resolve: any, reject: any) => {
            const xmlhttp = apiService.setXHR("GET", url, headers, null, resolve, reject);
            xmlhttp.send();
            getService.loggerInstance().info(`Api GET request send to url: ${url}`);
        });

    }

    /**
     * @function getData
     * @param url url to be hit
     * @param headers headers for the request if any
     * @description GET request for MIME-type applicaion/json being a mandate
     */
    public static getData<T>(url: string, headers?: Array<collab.utils.IRequestHeader>): Promise<T> {
        return new Promise((resolve: any, reject: any) => {

            const xmlhttp = apiService.setXHR("GET", url, headers, "application/json", resolve, reject);
            xmlhttp.send();
            getService.loggerInstance().info(`Api GET request send to url: ${url}`);
        });

    }

    /**
     * @function postData
     * @param url url to be hit
     * @param data data for post request to be made
     * @param headers headers for the request if any
     * @description POST request
     */
    public static postData(url: string, data: any, headers?: any) {

        return new Promise((resolve: any, reject: any) => {
            const xmlhttp = apiService.setXHR("POST", url, headers, "application/json", resolve, reject);
            xmlhttp.send(JSON.stringify(data));
            getService.loggerInstance().info(`Api POST request send to url: ${url}`);
        });
    }
}
