import { appConfig } from "../../../configs/appConfig";
const emojiTemplate = require("./main.html");
import * as ko from "knockout";
import { component } from "../../../decorators/component";

// Registers emojiComponent as component into knockout
@component({
    name: "emojiComponent",
    template: emojiTemplate
})
/**
 * @class
 * @classdesc Consists values for displaying emoticons
 */
export default class emojiController {

    private _env = ko.observable(appConfig.env);
    // Equivalent codes for emojis
    private emojiFaces = ko.observable([
        { name: ":grinning:" },
        { name: ":grimacing:" },
        { name: ":grin:" },
        { name: ":joy:" },
        { name: ":smiley:" },
        { name: ":smile:" },
        { name: ":sweat_smile:" },
        { name: ":laughing:" },
        { name: ":innocent:" },
        { name: ":wink:" },
        { name: ":blush:" },
        { name: ":relaxed:" },
        { name: ":wink:" },
        { name: ":angry:" },
        { name: ":yum:" },
        { name: ":heart_eyes:" },
        { name: ":stuck_out_tongue:" },
        { name: ":stuck_out_tongue_closed_eyes:" },
        { name: ":stuck_out_tongue_winking_eye:" },
        { name: ":relieved:" },
        { name: ":sunglasses:" },
        { name: ":smirk:" },
        { name: ":no_mouth:" },
        { name: ":neutral_face:" },
        { name: ":expressionless:" },
        { name: ":flushed:" },
        { name: ":disappointed:" },
        { name: ":worried:" },
        { name: ":rage:" },
        { name: ":pensive:" },
        { name: ":confused:" },
        { name: ":frowning:" },
        { name: ":persevere:" },
        { name: ":confounded:" },
        { name: ":tired_face:" },
        { name: ":weary:" },
        { name: ":triumph:" },
        { name: ":open_mouth:" },
        { name: ":scream:" },
        { name: ":triumph:" },
        { name: ":fearful:" },
        { name: ":cold_sweat:" },
        { name: ":hushed:" },
        { name: ":cry:" },
        { name: ":sleeping:" },
        { name: ":sleepy:" },
        { name: ":sob:" },
        { name: ":mask:" },
        { name: ":dizzy_face:" },
        { name: ":imp:" },
        { name: ":smiling_imp:" },
        { name: ":japanese_ogre:" },
        { name: ":japanese_goblin:" },
    ]);

    private emojiHands = ko.observable([
        { name: ":+1:" },
        { name: ":-1:" },
        { name: ":ok_hand:" },
        { name: ":open_hands:" },
        { name: ":raised_hands:" },
        { name: ":clap:" },
        { name: ":pray:" },
        { name: ":thumbsup:" },
        { name: ":raised_hands:" },
        { name: ":thumbsdown:" },
        { name: ":punch:" },
        { name: ":fist:" },
        { name: ":v:" },
        { name: ":metal:" },
        { name: ":ok_hand:" },
        { name: ":point_left:" },
        { name: ":point_right:" },
        { name: ":wave:" },
        { name: ":muscle:" },

    ]);

}
