const cont = require("./sharedDataService.ts");

describe("sharedData service", function () {

    let createControllerInst = () => {
        return new cont.default();
    }

    const methods = ["gradeSetting", "allUsersfromDb", "init"];
    var contInst;

    beforeEach(() => {
        contInst = createControllerInst();
    });

    it("should be defined", function () {
        expect(contInst).toBeDefined();
    });


    it("should have init function", function () {
        expect(contInst.init).toBeDefined();
    });

    it("should call init function", function () {
        let controller = createControllerInst();
        var cont = jasmine.createSpyObj(contInst, ['init']);
        cont.init();
        expect(cont.init).toHaveBeenCalled();
    });

    it("spy on getter gradeSetting ", function () {
        let controller = createControllerInst();
        spyOnProperty(contInst, 'gradeSetting', 'get').and.returnValue(1);
        expect(contInst.gradeSetting).toBe(1);
    });

    it("spy on setter gradeSetting ", () => {
        let controller = createControllerInst();
        var cont = spyOnProperty(contInst, 'gradeSetting', 'set');
        contInst.gradeSetting = true;
        expect(cont).toHaveBeenCalled();
    });

    it("spy on getter allUsersfromDb ", function () {
        let controller = createControllerInst();
        spyOnProperty(contInst, 'allUsersfromDb', 'get').and.returnValue(1);
        expect(contInst.allUsersfromDb).toBe(1);
    });

    it("after setting gradeSetting it should return same value", function () {
        const value = 'abc';
        contInst.gradeSetting = value;
        expect(contInst.gradeSetting).toBe('abc');
    });
});