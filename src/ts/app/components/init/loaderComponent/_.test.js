const cont = require("./_.controller.ts");
const config = require("./../../../../configs/appConfig");

describe("loader controller", function () {

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

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });

});

