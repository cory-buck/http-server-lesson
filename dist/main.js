"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
const server_1 = require("./server");
const mainLogger = new log_1.Log("main");
const server = new server_1.Server();
mainLogger.i("starting up");
server.start();
setTimeout(() => {
    mainLogger.i("shutting down");
    server.stop();
}, 10000);
