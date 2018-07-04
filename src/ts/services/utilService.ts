/**
 * @class
 * @classdesc Consists of utility methods
 */
export default class utils {
    /**
     * @function imageExtn
     * @returns An array of strings
     * @description Gives an array of image extensions
     */
    public static get imageExtn() {
        return ["jpeg", "jpg", "png", "gif"];
    }

    /**
     * @function camelCaseToDashed
     * @param value A camel-cased string value
     * @returns A dashed valued string
     * @description Converts a string from camel-cased to dashed value
     */
    public static camelCaseToDashed(value: string) {
        return value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }

    /**
     * @function dashedToCamelCase
     * @param value A dashed valued string
     * @returns A camel-cased string value
     * @description Converts a string from dashed to camel-cased value
     */
    public static dashedToCamelCase(value: string) {
        value = value.toLowerCase();
        return value.replace(/-([a-z])/g, (g: string) => {
            return g[1].toUpperCase();
        });
    }

    /**
     * @function find
     * @param arr An array
     * @param operation Finding criteria
     * @returns The element
     * @description Finds an element in an array
     */
    public static find<T>(arr: Array<T>, operation: any): T {
        return arr.filter(operation)[0];
    }

    /**
     * @function cloneDeep
     * @param data An object
     * @returns A JSON object
     */
    public static cloneDeep(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    /**
     * @function randomNumber
     * @param min Minimum value
     * @param max Maximum value
     * @returns A random number
     * @description Returns a random number
     */
    public static randomNumber(min = 1, max = 9999999) {
        return Math.floor(Math.random() * max) + min;
    }

    /**
     * @function makeEllipsis
     * @param str A string value
     * @param maxLength length after which the ellipsis is to be shown
     * @description Puts in an ellipsis after a string that exceeds a certain length
     */
    public static makeEllipsis(str: string, maxLength: number) {
        str = str.length > maxLength ? str.substr(0, maxLength) + "..." : str;
        return str;
    }
}
