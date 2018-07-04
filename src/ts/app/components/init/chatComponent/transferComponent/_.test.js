import * as ko from "knockout";
const cont = require("./_.controller.ts");
const config = require("./../../../../../configs/appConfig");

describe("transfer controller", function () {

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

    it("controller should have init, dispose, close_chat_transfer function", function () {
        expect(contInst.init).toBeDefined();
        expect(contInst.dispose).toBeDefined();
        expect(contInst.close_chat_transfer).toBeDefined();
    });

    it("should call init, dispose, close_chat_transfer method", () => {
        let controller = createControllerInst();
        var cont = jasmine.createSpyObj(contInst, ['init', 'dispose', 'close_chat_transfer']);
        cont.init();
        expect(cont.init).toHaveBeenCalled();
        cont.dispose();
        expect(cont.dispose).toHaveBeenCalled();
        cont.close_chat_transfer();
        expect(cont.close_chat_transfer).toHaveBeenCalled();
    });

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });

});

