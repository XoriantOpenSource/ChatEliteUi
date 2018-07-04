const cont = require("./_.controller.ts");
const config = require("./../../../../configs/appConfig");

describe("home controller", function () {

    let createControllerInst = () => {
        return new cont.default();
    }

    var contInst;
    beforeEach(() => {
        config.appConfig.env = 'desktop';
        contInst = createControllerInst();
    });

    it("controller should be defined", function () {
        expect(contInst).toBeDefined();
    });

    it("controller should have init function", function () {
        expect(contInst.init).toBeDefined();
    });

    it("should call init method", () => {
        let controller = createControllerInst();
        var cont = jasmine.createSpyObj(contInst, ['init']);
        cont.init();
        expect(cont.init).toHaveBeenCalled();
    });

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });
});

