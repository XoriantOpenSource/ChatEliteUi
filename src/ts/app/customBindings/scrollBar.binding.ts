
import { binding } from "../../decorators/bindings";
import * as ko from "knockout";
import getService from "../../services/getService";

@binding("scrollBar")
class scrollBar {

    public static init(element: any, valueAccessor: any, allBindings: any) {
        // $(element).perfectScrollbar();
    }

    public static update(element: any, valueAccessor: any, allBindings: any) {
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        // $(element).perfectScrollbar("update");
    }

}
