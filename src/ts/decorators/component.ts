import { decorators } from "../configs/globalVariables";
import * as ko from "knockout";
import getService from "../services/getService";

/**
 * @function component
 * @param component Component details
 * @returns A  knockout component for the target element
 * @description Registers a custom component to knockout
 */
export function component(component: collab.decorator.IComponent) {

    return (target: any) => {
        ko.components.register(getService.utilsInstance().camelCaseToDashed(component.name), {
            viewModel: target,
            template: component.template
        });
    };

}
/**
 * @function bootstrap
 * @param component bootstrap component details
 * @returns A bootstrap component
 * @description Registers a component for boot into knockout
 */
export function bootstrap(component: collab.decorator.IBootstrap) {

    return (target: any) => {
        decorators.push({
            name: "bootstrap",
            component: {
                name: "bootstrap",
                template: component.template
            },
            target: target
        });

        ko.components.register(getService.utilsInstance().camelCaseToDashed("initComponent"), {
            viewModel: target,
            template: component.template
        });
    };

}
