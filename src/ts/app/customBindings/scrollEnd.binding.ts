
import { binding } from "../../decorators/bindings";
import * as ko from "knockout";

/**
 * Registers scrollEnd as a custom binding in knockout
 */
@binding("scrollEnd")
class scrollEnd {

    public static init() {

    }

    public static update(element: any, valueAccessor: any, allBindings: any) {

        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped) {
            element.scrollTop = element.scrollHeight;
        }

    }

}
