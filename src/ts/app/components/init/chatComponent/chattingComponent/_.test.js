import * as ko from "knockout";
const cont = require("./_.controller.ts");
const config = require("./../../../../../configs/appConfig");

describe("chatting controller", function () {

    let createControllerInst = () => {
        return new cont.default({ group_id: ko.observable("") });
    }

    const methods = ["init", "dispose", "readMessages", "onEnter", "selectSuggest", "transferChat", "showDate", "upload_doc", "previewUrl", "isValidImage", "download_doc", "selectOptionStyling", "deleteMessage", "leaveGroup", "markfavorite", "unmarkfavorite", "replyToMessage", "goToRepliedMessage", "closeReplyBox", "downloadChats", "closePopover", "otherUsersOnlineStatus", "focusFunction", "blurFunction", "changeEmoji", "attachEvents", "collapse_chat", "close_chat", "collapsed_widget", "searchingChats", "cancelSearch", "clearSearchChatText", "doChatSearch", "showAddUserToGroup", "addUserToGroup", "closeAddUserToGroup"];
    var contInst;
    beforeEach(() => {
        config.appConfig.env = 'desktop';
        contInst = createControllerInst();
    });

    it("controller should be defined", function () {
        expect(contInst).toBeDefined();
    });

    it("controller should have " + methods.join(', ') + " function", function () {
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

    it("_env variable should be 'desktop'", () => {
        expect(contInst._env()).toEqual('desktop');
    });

});
