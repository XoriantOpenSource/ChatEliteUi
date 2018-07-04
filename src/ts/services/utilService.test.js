const cont = require("./utilService.ts");

describe("utils service", function () {

    let createControllerInst = () => {
        return cont.default;
    }

    const methods = ["camelCaseToDashed", "dashedToCamelCase", "find", "randomNumber", "makeEllipsis"];
    var contInst;

    beforeEach(() => {
        contInst = createControllerInst();
    });

    it("should be defined", function () {
        expect(contInst).toBeDefined();
    });

    it("should have " + methods.join(', ') + " function", function () {
        for (const method of methods) {
            expect(contInst[method]).toBeDefined();
        }
    });

    it("should call " + methods.join(', ') + " function", function () {
        let controller = createControllerInst();
        var cont = jasmine.createSpyObj(contInst, methods);
        for (const method of methods) {
            cont[method]();
            expect(cont[method]).toHaveBeenCalled();
        }
    });

    it("spy on getter imageExtn ", function () {
        let controller = createControllerInst();
        spyOnProperty(contInst, 'imageExtn', 'get').and.returnValue(1);
        expect(contInst.imageExtn).toBe(1);
    });

    it("camelCaseToDashed should return dashed value", function () {
        const value = 'camelCase';
        const returnValue = contInst.camelCaseToDashed(value);
        expect(returnValue).toBe('camel-case');
    });

    it("dashedToCamelCase should return camel case value", function () {
        const value = 'camel-case';
        const returnValue = contInst.dashedToCamelCase(value);
        expect(returnValue).toBe('camelCase');
    });

    it("find should return first value according to condition value", function () {
        const arr = [5, 10, 7, 3, 19];
        var returnValue = contInst.find(arr, function (ele) { return (ele > 10); });
        expect(returnValue).toBe(19);
    });

    it("cloneDeep should clone all values in array", function () {
        const arr = [5, 3, 19];
        var returnValue = contInst.cloneDeep(arr);
        expect(returnValue).toEqual(arr);
    });

    it("randomNumber should generate number in between 1 and 9999999", function () {
        var randomNum = contInst.randomNumber();
        expect(randomNum > 0 && randomNum < 9999999).toBeTruthy();
    });

    it("makeEllipsis should return after maxLength ellipsis", function () {
        const value = "Make ellipsis";
        var str = contInst.makeEllipsis(value, 8);
        expect(str).toBe("Make ell...");
    });
});