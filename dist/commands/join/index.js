"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const enums_1 = require("../../enums");
class Join extends classes_1.Command {
    constructor() {
        super(__filename);
    }
    get Restrictions() {
        return enums_1.ERestrictions.ADMIN_ONLY;
    }
    async run() {
        if (this.Message.channel.type != 'text')
            return;
        if (!this.Message.guild.available)
            return;
        if (this.Caller.voiceChannel) {
            this.Caller.voiceChannel.join();
        }
    }
}
exports.default = Join;
