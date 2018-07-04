const cont = require("./_.controller.ts");
const config = require("./../../../configs/appConfig");

describe("init controller", function () {


    let createControllerInst = () => {
        return new cont.default();
    }

    var contInst;
    beforeEach(() => {
        config.appConfig.env = 'desktop';
        contInst = createControllerInst();
    });

    it("controller should be defined", () => {
        expect(contInst).toBeDefined();
    });

    it("controller should have init, dispose, showChatEngine function", () => {
        expect(contInst.init).toBeDefined();
        expect(contInst.dispose).toBeDefined();
        expect(contInst.showChatEngine).toBeDefined();
    });

    it("should call init, dispose, showChatEngine method", () => {
        let controller = createControllerInst();
        var cont = jasmine.createSpyObj(contInst, ['init', 'dispose', 'showChatEngine']);
        cont.init();
        expect(cont.init).toHaveBeenCalled();
        cont.dispose();
        expect(cont.dispose).toHaveBeenCalled();
        cont.showChatEngine();
        expect(cont.showChatEngine).toHaveBeenCalled();
    });

    it("after controller's showChatEngine method call showEngine variable should be true", () => {
        expect(contInst.showEngine()).toBeFalsy();
        contInst.showChatEngine();
        expect(contInst.showEngine()).toBeTruthy();
    });

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });
});

