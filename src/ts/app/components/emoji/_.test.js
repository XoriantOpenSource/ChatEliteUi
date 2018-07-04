const cont = require("./_.controller.ts");
const config = require("./../../../configs/appConfig");

describe("emoji controller", function () {

    var contInst;
    beforeEach(() => {
        config.appConfig.env = 'desktop';
        contInst = new cont.default();
    });

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });

});

