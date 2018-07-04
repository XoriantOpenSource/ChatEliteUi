import * as ko from "knockout";
const cont = require("./_.controller.ts");
const config = require("./../../../../../configs/appConfig");

describe("profile controller", function () {

    let createControllerInst = () => {
        return new cont.default({ res: ko.observable("") });
    }

    var contInst;
    beforeEach(() => {
        config.appConfig.env = 'desktop';
        contInst = createControllerInst();
    });

    it("controller should be defined", function () {
        expect(contInst).toBeDefined();
    });

    it("controller should have init, dispose, showP2PChat function", function () {
        expect(contInst.init).toBeDefined();
        expect(contInst.dispose).toBeDefined();
        expect(contInst.showP2PChat).toBeDefined();
    });

    it("should call init, dispose, showP2PChat method", () => {
        let controller = createControllerInst();
        var cont = jasmine.createSpyObj(contInst, ['init', 'dispose', 'showP2PChat']);
        cont.init();
        expect(cont.init).toHaveBeenCalled();
        cont.dispose();
        expect(cont.dispose).toHaveBeenCalled();
        cont.showP2PChat();
        expect(cont.showP2PChat).toHaveBeenCalled();
    });

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });

});

