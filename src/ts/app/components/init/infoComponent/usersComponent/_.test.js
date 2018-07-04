const cont = require("./_.controller.ts");
const config = require("./../../../../../configs/appConfig");

describe("users controller", function () {

    let createControllerInst = () => {
        return new cont.default();
    }
    const methods = ["init", "dispose", "onIndexSelected", "changeIcon", "focusOnSearch", "showp2pchat", "removeUser", "addUserInTickerList", "isAddedOrNot", "statusClass", "profileImg", "closePopover", "showProfile"];
    var contInst;
    beforeEach(() => {
        config.appConfig.env = 'desktop';
        contInst = createControllerInst();
    });

    it("controller should be defined", function () {
        expect(contInst).toBeDefined();
    });

    it("controller should have " + methods.join(', ') + " function", function () {
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

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });

});

