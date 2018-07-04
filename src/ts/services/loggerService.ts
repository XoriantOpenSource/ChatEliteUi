import { debugMode } from "../configs/enums";
import { appConfig } from "../configs/appConfig";

/**
 * @class
 * @classdesc Logs messages
 */
export default class loggerService {

    /**
     * Logs a debug message
     * @param message A message string
     */
    public debug(message: string) {

        if (appConfig.debug_mode && window.console && debugMode.debug <= appConfig.debug_mode) {
            console.debug(`UI Logger: ${message}`);
        }
    }

    /**
     * Logs an info message
     * @param message A message string
     */
    public info(message: string) {

        if (appConfig.debug_mode && window.console && debugMode.info <= appConfig.debug_mode) {
            console.info(`UI Logger: ${message}`);
        }
    }

    /**
     * Logs a warning message
     * @param message A message string
     */
    public warn(message: string) {
        if (appConfig.debug_mode && window.console && debugMode.warn <= appConfig.debug_mode) {
            console.warn(`UI Logger: ${message}`);
        }
    }

    /**
     * Logs an error message
     * @param message A message string
     */
    public error(message: string) {
        if (appConfig.debug_mode && window.console && debugMode.error <= appConfig.debug_mode) {
            console.warn(`UI Logger: ${message}`);
        }
    }

}
