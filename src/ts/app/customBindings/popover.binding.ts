
import { binding } from "../../decorators/bindings";
import * as ko from "knockout";
import getService from "../../services/getService";

/**
 * Registers poppOver as a custom binding in knockout
 */
@binding("popOver")
/**
 * @class
 * @classdesc Binding to display a popover
 */
class popOver {

    public static init() {

    }

    /**
     * This will be called once when the binding is first applied to an element,
     * and again whenever any observables/computeds that are accessed change.
     * Update the DOM element based on the supplied values here.
     * @param element An element
     * @param valueAccessor A JavaScript function that you can call to get the current model property that is involved in this binding.
     * @param allBindings A JavaScript object that you can use to access all the model values bound to this DOM element.
     */
    public static update(element: any, valueAccessor: any, allBindings: any) {

        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        const uniqueId = getService.utilsInstance().randomNumber();
        $($(element).find("div[template]")[0]).attr("id", uniqueId);
        const width = valueUnwrapped.width ? valueUnwrapped.width : "auto";
        const title = valueUnwrapped.title ? valueUnwrapped.title : "";
        const padding = valueUnwrapped.padding === "false" ? false : true;
        const autoHide = valueUnwrapped.autoHide ? valueUnwrapped.autoHide : false;
        $(element).webuiPopover({ url: "#" + uniqueId, trigger: valueUnwrapped.trigger, animation: "pop", placement: valueUnwrapped.placement, width: width, title: title, padding: padding, dismissible: true, multi: false, autoHide: autoHide });

    }

}
