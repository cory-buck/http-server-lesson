"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    constructor(label) {
        this.label = label;
    }
    i(message) {
        this.logMessage("INFO", message);
    }
    e(message) {
        this.logMessage("ERROR", message);
    }
    w(message) {
        this.logMessage("WARNING", message);
    }
    logMessage(type, message) {
        console.log(`${new Date().toISOString()} ${this.label} [${type}] ${message}`);
    }
}
exports.Log = Log;
