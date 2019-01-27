"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const enums_1 = require("../../enums");
class Leave extends classes_1.Command {
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
        const connection = this.Message.guild.voiceConnection;
        if (connection) {
            connection.channel.leave();
        }
    }
}
exports.default = Leave;
