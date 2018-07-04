
import { binding } from "../../decorators/bindings";
import * as ko from "knockout";
import getService from "../../services/getService";

/**
 * Registers chardin as a custom binding in knockout
 */
@binding("chardin")
/**
 * @class
 * @classdesc Binding for displaying ChatElite guide using chardin.js;
 */
class chardin {
    /**
     * This will be called when the binding is first applied to an element.
     *  Set up any initial state, event handlers, etc. here.
     * @param element list element
     * @param valueAccessor   A JavaScript function that you can call to get the current model property that is involved in this binding.
     * @param allBindings A JavaScript object that you can use to access all the model values bound to this DOM element.
     */
    public static init(element: HTMLLIElement, valueAccessor: any, allBindings: any) {
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
    }

    /**
     * This will be called once when the binding is first applied to an element,
     * and again whenever any observables/computeds that are accessed change.
     * Update the DOM element based on the supplied values here.
     * @param element list element
     * @param valueAccessor A JavaScript function that you can call to get the current model property that is involved in this binding.
     * @param allBindings A JavaScript object that you can use to access all the model values bound to this DOM element.
     */
    public static update(element: HTMLLIElement, valueAccessor: any, allBindings: any) {
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped.data) {
            $(element).attr("data-intro", valueUnwrapped.data_intro);
            $(element).attr("data-position", valueUnwrapped.data_position);
        }
    }

}
