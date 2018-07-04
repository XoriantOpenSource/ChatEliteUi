import socketio from "./socketio";
import apiService from "./apiService";
import domService from "./domManipService";
import utils from "./utilService";
import logger from "./loggerService";
import userService from "./userService";
import errorService from "./errorService";
import chatGroupService from "./chatGroupService";
import notificationService from "./notificationService";
import sharedDataService from "./sharedDataService";
import cacheChatService from "./cacheChatsService";

/**
 * @class
 * @classdesc Creates instances of all services
 */
export default class getService {

    private static socketIoServiceInst: socketio;
    private static loggerServiceInst: logger;
    private static userServiceInst: userService;
    private static errorServiceInt: errorService;
    private static chatGroupServiceInt: chatGroupService;
    private static notificationInstance: notificationService;
    private static sharedDataInstance: sharedDataService;
    private static cacheChatServiceInstance: cacheChatService;

    /**
     * Creates and returns errorService instance
     */
    public static errorServiceInstance() {

        if (!getService.errorServiceInt) {
            getService.errorServiceInt = new errorService();
        }

        return getService.errorServiceInt;
    }
    /**
     * Creates and returns chatGroupService instance
     */
    public static chatGroupServiceInstance() {

        if (!getService.chatGroupServiceInt) {
            getService.chatGroupServiceInt = new chatGroupService();
        }

        return getService.chatGroupServiceInt;
    }

    /**
     * Creates and returns userService instance
     */
    public static userServiceInstance() {

        if (!getService.userServiceInst) {
            getService.userServiceInst = new userService();
        }

        return getService.userServiceInst;
    }

    /**
     * Creates and returns socketioservice instance
     */
    public static socketioInstance() {

        if (!getService.socketIoServiceInst) {
            getService.socketIoServiceInst = new socketio();
        }

        return getService.socketIoServiceInst;
    }
    public static loggerInstance() {

        if (!getService.loggerServiceInst) {
            getService.loggerServiceInst = new logger();
        }

        return getService.loggerServiceInst;
    }

    /**
     * Creates and returns notificationService instance
     */
    public static notificationServiceInstance() {

        if (!getService.notificationInstance) {
            getService.notificationInstance = new notificationService();
        }

        return getService.notificationInstance;
    }

    /**
     * Creates and returns sharedDataService instance
     */
    public static sharedDataServiceInstance() {

        if (!getService.sharedDataInstance) {
            getService.sharedDataInstance = new sharedDataService();
        }

        return getService.sharedDataInstance;
    }

    /**
     * Creates and returns domManipService instance
     */
    public static domManipInstance() {

        return domService;
    }

    /**
     * Creates and returns utilsService instance
     */
    public static utilsInstance() {

        return utils;
    }

    /**
     * Creates and returns apiService instance
     */
    public static apiServiceInstance() {
        return apiService;
    }

    /**
     * Creates and returns cacheChatService instance
     */
    public static cacheChatInstance() {
        if (!getService.cacheChatServiceInstance) {
            getService.cacheChatServiceInstance = new cacheChatService();
        }

        return getService.cacheChatServiceInstance;
    }

}
