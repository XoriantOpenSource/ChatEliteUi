/**
 * @enum Types of debug mode
 */
export enum debugMode {
    error = 2,
    warn = 3,
    info = 4,
    debug = 5
}

/**
 * @enum Represents the status of the user
 */
export enum onlineStatus {
    online = 1,
    away = 2,
    offline = 3
}

/**
 * @class
 * @description Various types of messages considered
 */
export class chatType {
    public static text = "text";
    public static doc = "doc";
    public static message = "message";
}

/**
 * @enum Types of notification
 */
export class notificationType {
    public static message = "message";
    public static online = "online";
}

/**
 * @enum Represents the platform(s) used
 */
export enum platform {
    web = 1,
    mobile = 2
}

/**
 * @enum Various OS and browsers
 */
export enum os {
    android = 1,
    ios = 2,
    firefox = 3,
    chrome = 4,
    other = 5
}
