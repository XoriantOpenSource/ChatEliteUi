import { binding } from "../../decorators/bindings";
import getService from "../../services/getService";
import * as ko from "knockout";
import { appConfig } from "../../configs/appConfig";

/**
 * Registers grade as a custom binding in knockout
 */
@binding("grade")
/**
 * @class
 * @classdesc Binding to provide gradewise features
 */
class grade {
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
        const gradeSettings = getService.sharedDataServiceInstance().gradeSetting;

        const setting: any = gradeSettings.find((ele: any) => {
            return ele.feature === valueUnwrapped.feature;
        });

        if (appConfig.user_details.grade) {
            // Do not display the element if grade is less than in the features list in grade settings
            if (setting.grade === null || (setting.grade.length && setting.grade.indexOf(appConfig.user_details.grade) === -1)) {
                $(element).remove();
            }
        }

    }

    public static update(element: any, valueAccessor: any, allBindings: any) {

    }
}
