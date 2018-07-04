import * as ko from "knockout";
/**
 * @function binding
 * @param name string name for the custom binding
 * @returns A knockout binding for the target element
 * @description Registers a custom binding to knockout
 */
export function binding(name: string) {

    return (target: any) => {
        ko.bindingHandlers[name] = {
            init: target.init,
            update: target.update
        };
    };
}
