/**
 * @class
 * @classdesc Handles DOM manipulation
 */
export default class domManip {

    /**
     * @function createElem
     * @param template the template of the element to be created
     * @param appendToElement Element to be appended to
     * @param id id if any
     * @description Creates an element
     */
    public static createElem(template: string, appendToElement: Element, id?: string) {

        const elem = document.createElement("div");
        if (id) {
            elem.id = id;
        }
        elem.insertAdjacentHTML("beforeend", template);
        appendToElement.appendChild(elem);
    }

    /**
     * @function createElemTag
     * @param tagName name of the tag
     * @param appendToElement Element to be appended to
     * @description Creates an element tag
     */
    public static createElemTag(tagName: string, appendToElement: Element) {

        const elem = document.createElement(tagName);

        elem.insertAdjacentHTML("beforeend", tagName);
        appendToElement.appendChild(elem);
    }
}
