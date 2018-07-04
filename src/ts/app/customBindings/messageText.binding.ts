
import { binding } from "../../decorators/bindings";
import * as ko from "knockout";

/**
 * Registers grade as a messageText binding in knockout
 */
@binding("messageText")
/**
 * @class
 * @classdesc Binding to apply EmbedJS properties to text message
 */
class messageText {
    /**
     * This will be called when the binding is first applied to an element.
     *  Set up any initial state, event handlers, etc. here.
     * @param element An element
     * @param valueAccessor   A JavaScript function that you can call to get the current model property that is involved in this binding.
     * @param allBindings A JavaScript object that you can use to access all the model values bound to this DOM element.
     */
    public static init(element: any, valueAccessor: any, allBindings: any) {
        const value = valueAccessor();
        const valueUnwrapped = ko.unwrap(value);
        const win: any = window;
        const x = new win.EmbedJS({
            // googleAuthKey: "AIzaSyDcmXtiqS0Cj4ywPiSpBb9IzDzr3lyi6Yo",
            input: element,
            inlineEmbed: "all",
            marked: true,
            highlightCode: true,
            linkOptions: {
                target: "_blank",
                exclude: [],
                rel: ""
            }
            // plyr: true
        });
        x.render();

    }

    public static update(element: any, valueAccessor: any, allBindings: any) {

    }
}
