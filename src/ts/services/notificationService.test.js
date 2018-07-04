const cont = require("./notificationService.ts");

describe("notification service", function () {

    let createControllerInst = () => {
        return new cont.default();
    }

    const methods = ["init", "notify"];
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
});