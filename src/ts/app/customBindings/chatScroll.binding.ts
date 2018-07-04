
import { binding } from "../../decorators/bindings";
import * as ko from "knockout";
import getService from "../../services/getService";

/**
 * Registers chatScroll as a custom binding in knockout
 */
@binding("chatScroll")
/**
 * @class
 * @classdesc Binding to set chat messages as read on scroll event
 */
class chatScroll {
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
        const win: any = window;
        $("#_chat-history").on("scroll", () => {
            const pos = $(element).position();
            if (pos.top >= 0) {
                // Sets a message as read on scrolling it
                getService.chatGroupServiceInstance().setReadChats(valueUnwrapped.group_id, valueUnwrapped.chat_id);

                let text = win.moment(new Date(new Date(valueUnwrapped.dateTime).getTime()).toLocaleDateString(), "MM/DD/YYYY").format("LL");
                if (text === "Invalid date") {
                    text = win.moment(new Date(new Date(valueUnwrapped.dateTime).getTime()).toLocaleDateString()).format("LL");
                }

                if (pos.top <= 40) {
                    $("._date").text(text);
                }
            }
        });

        $("#_chat-history").on("_scroll-now", (detail) => {
            const pos = $(element).position();
            if (pos.top >= 0) {
                // Sets a message as read on scrolling it
                getService.chatGroupServiceInstance().setReadChats(valueUnwrapped.group_id, valueUnwrapped.chat_id);

                let text = win.moment(new Date(new Date(valueUnwrapped.dateTime).getTime()).toLocaleDateString(), "MM/DD/YYYY").format("LL");
                if (text === "Invalid date") {
                    text = win.moment(new Date(new Date(valueUnwrapped.dateTime).getTime()).toLocaleDateString()).format("LL");
                }

                if (pos.top <= 40) {
                    $("._date").text(text);
                }
            }
        });
    }

    public static update(element: HTMLLIElement, valueAccessor: any, allBindings: any) {

    }

}
