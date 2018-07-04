const cont = require("./_.controller.ts");
const config = require("./../../../../configs/appConfig");

describe("chat controller", function () {

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

    it("controller should have init, dispose function", function () {
        expect(contInst.init).toBeDefined();
        expect(contInst.dispose).toBeDefined();
    });

    it("should call init, dispose method", () => {
        let controller = createControllerInst();
        var cont = jasmine.createSpyObj(contInst, ['init', 'dispose']);
        cont.init();
        expect(cont.init).toHaveBeenCalled();
        cont.dispose();
        expect(cont.dispose).toHaveBeenCalled();
    });

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });

});

