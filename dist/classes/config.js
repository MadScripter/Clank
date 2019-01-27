"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pino = require("pino");
const dotprop = require("dot-prop");
const fs_extra_1 = require("fs-extra");
class Config {
    constructor() {
        this.path = '';
        this.content = undefined;
        this.logger = pino({
            name: 'config'
        });
    }
    load(path) {
        const exists = fs_extra_1.pathExistsSync(path);
        if (!exists)
            throw new Error('config.json is missing');
        const content = fs_extra_1.readJSONSync(path, { throws: true });
        this.content = content;
    }
    reload() {
    }
    save() {
        fs_extra_1.writeJSON(this.path, this.content, { spaces: 4 }).catch(this.logger.error);
    }
    watch() {
    }
    get(key) {
        return dotprop.get(this.content, key);
    }
    set(key, value) {
        dotprop.set(this.content, key, value);
    }
    has(key) {
        return dotprop.has(this.content, key);
    }
    delete(key) {
        return dotprop.delete(this.content, key);
    }
    get Content() {
        return this.content;
    }
}
exports.default = Config;
