const cont = require("./userService.ts");
const config = require("./../configs/appConfig");

describe("user service", function () {

    let createControllerInst = () => {
        return new cont.default();
    }

    const methods = ["logout", "getUserDetails", "mapUserToConfig", "loginManual", "joinSocketUser"];
    var contInst;
    window.__collab_config.user_details_sign = {
        id: "user_id",
        name: "user_name",
        img: "profile_img",
        grade: "grade"
    };
    const mockUser = {
        "user_id": "doe_jane",
        "user_name": "Jane Doe",
        "profile_img": "https://demos.subinsb.com/isl-profile-pic/image/person.png",
        "grade": "5"
    };

    beforeEach(() => {
        contInst = createControllerInst();
    });

    it("should be defined", function () {
        expect(contInst).toBeDefined();
    });

    it("should have " + methods.join(', ') + " function", function () {
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

    // it("loginManual function should store user in config user_details", function () {
    //     const res = contInst.loginManual(mockUser);
    //     console.log(res);
    //     expect(config.user_details).toEqual(mockUser)
    // });
});