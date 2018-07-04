const cont = require("./_.controller.ts");
const config = require("./../../../../configs/appConfig");

describe("info controller", function () {

    // Cannot read property 'initializeApp' of undefined

    // let createControllerInst = () => {
    //     return new cont.default();
    // }

    // var contInst;
    // beforeEach(() => {
    //     config.appConfig.env = 'desktop';
    //     contInst = createControllerInst();
    // });

    // it("controller should be defined", function () {
    //     expect(contInst).toBeDefined();
    // });

    // it("controller should have init, dispose, showUsersComponent, showGroupsComponent function", function () {
    //     expect(contInst.init).toBeDefined();
    //     expect(contInst.dispose).toBeDefined();
    //     expect(contInst.showUsersComponent).toBeDefined();
    //     ecpect(contInst.showGroupsComponent).toBeDefined();
    // });


    // it("should call init, dispose, showUsersComponent, showGroupsComponent function", function () {
    //     let controller = createControllerInst();
    //     var cont = jasmine.createSpyObj(contInst, ['init', 'dispose', 'showUsersComponent', 'showGroupsComponent']);
    //     cont.init();
    //     expect(cont.init).toHaveBeenCalled();
    //     cont.dispose();
    //     expect(cont.dispose).toHaveBeenCalled();
    //     cont.showUsersComponent();
    //     expect(cont.showUsersComponent).toHaveBeenCalled();
    //     cont.showGroupsComponent();
    //     expect(cont.showGroupsComponent).toHaveBeenCalled();
    // });

    // it("after showUsersComponent method call _showUsersComponent variable should be true", () => {
    //     expect(contInst._showUsersComponent()).toBeFalsy();
    //     contInst.showUsersComponent();
    //     expect(contInst._showUsersComponent()).toBeTruthy();
    // });

    // it("after showGroupsComponent method call _showGroupsComponent variable should be true", () => {
    //     expect(contInst._showGroupsComponent()).toBeFalsy();
    //     contInst.showGroupsComponent();
    //     expect(contInst._showGroupsComponent()).toBeTruthy();
    // });

    // it("_env variable should be 'desktop'", () => {
    //     expect(contInst._env()).toEqual('desktop');
    // });

});

