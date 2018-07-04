import { binding } from "../../decorators/bindings";
import * as ko from "knockout";

/**
 * Registers moment as a custom binding in knockout
 */
@binding("moment")
/**
 * @class
 * @classdesc Binding to apply moment.js format to date
 */
class moment {
    /**
     * This will be called when the binding is first applied to an element.
     *  Set up any initial state, event handlers, etc. here.
     * @param element list element
     * @param valueAccessor   A JavaScript function that you can call to get the current model property that is involved in this binding.
     * @param allBindings A JavaScript object that you can use to access all the model values bound to this DOM element.
     */
    public static init(element: HTMLLIElement, valueAccessor: any, allBindings: any) {

        const win: any = window;
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped && valueUnwrapped.date_time) {
            element.textContent = win.moment(valueUnwrapped.date_time).format("h:mm a");
            element.title = new Date(valueUnwrapped.date_time).toLocaleString();
        }
    }

    public static update(element: HTMLLIElement, valueAccessor: any, allBindings: any) {
        const win: any = window;
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped && valueUnwrapped.date_time) {
            element.textContent = win.moment(valueUnwrapped.date_time).format("h:mm a");
            element.title = new Date(valueUnwrapped.date_time).toLocaleString();
        }

    }
}

/**
 * Registers momentStart as a custom binding in knockout
 */
@binding("momentStart")
class momentStart {
    /**
     * This will be called when the binding is first applied to an element
     *  Set up any initial state, event handlers, etc. here
     * @param element list element
     * @param valueAccessor   A JavaScript function that you can call to get the current model property that is involved in this binding
     * @param allBindings A JavaScript object that you can use to access all the model values bound to this DOM element
     */
    public static init(element: HTMLLIElement, valueAccessor: any, allBindings: any) {

        const win: any = window;
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped && valueUnwrapped.date_time && valueUnwrapped.duration) {
            const index = (valueUnwrapped.duration.length - 17);
            const str = valueUnwrapped.duration.substr(index, index + 8);
            const durationArray = str.split(":");
            const startTime = win.moment(valueUnwrapped.date_time).subtract(parseInt(durationArray[0]), "hours").subtract(parseInt(durationArray[1]), "minutes").subtract(parseInt(durationArray[2]), "seconds").toISOString();
            element.textContent = win.moment(startTime).format("h:mm a");
            element.title = new Date(startTime).toLocaleString();
        }
    }

    /**
     * This will be called once when the binding is first applied to an element,
     * and again whenever any observables/computeds that are accessed change
     * Update the DOM element based on the supplied values here.
     * @param element list element
     * @param valueAccessor A JavaScript function that you can call to get the current model property that is involved in this binding
     * @param allBindings A JavaScript object that you can use to access all the model values bound to this DOM element
     */
    public static update(element: HTMLLIElement, valueAccessor: any, allBindings: any) {
        const win: any = window;
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped && valueUnwrapped.date_time) {
            element.textContent = win.moment(valueUnwrapped.date_time).format("h:mm a");
            element.title = new Date(valueUnwrapped.date_time).toLocaleString();
        }

    }
}

/**
 * Registers momentDate as a custom binding in knockout
 */
@binding("momentDate")
class momentDate {

    public static init() {

    }
    /**
     * This will be called once when the binding is first applied to an element,
     * and again whenever any observables/computeds that are accessed change
     * Update the DOM element based on the supplied values here.
     * @param element list element
     * @param valueAccessor A JavaScript function that you can call to get the current model property that is involved in this binding
     * @param allBindings A JavaScript object that you can use to access all the model values bound to this DOM element
     */
    public static update(element: HTMLLIElement, valueAccessor: any, allBindings: any) {
        const win: any = window;
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped) {
            // element.innerText = win.moment(new Date(new Date(valueUnwrapped).getTime()).toLocaleDateString(), "MM/DD/YYYY").format("LL");
            element.textContent = win.moment(new Date(valueUnwrapped)).format("LL");
            if (element.textContent === "Invalid date") {
                // element.innerText = win.moment(new Date(new Date(valueUnwrapped).getTime()).toLocaleDateString()).format("LL");
                element.textContent = win.moment(new Date(valueUnwrapped)).format("LL");
            }
        }

    }

}
