"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const log_1 = require("../log");
const fs_1 = __importDefault(require("fs"));
class Server {
    constructor() {
        this.logger = new log_1.Log("Server");
        this.server = http.createServer((req, res) => {
            this.logger.i(`REQUEST: ${req.url}`);
            if (req.url && fs_1.default.existsSync("./" + req.url)) {
                const contents = fs_1.default.readFileSync("./" + req.url);
                res.writeHead(200, { "Content-type": "application/json" });
                res.write(contents);
                res.end();
            }
            else {
                res.writeHead(404, { "Content-type": "application/json" });
                res.write(JSON.stringify({
                    "error": "file not found"
                }));
                res.end();
            }
        });
        this.server.on("connection", () => this.logger.i("NEW CONNECTION"));
        this.server.on("listening", () => this.logger.i("LISTENING"));
        this.server.on("close", () => this.logger.i("CLOSED"));
        this.server.on("error", (e) => this.logger.i(`ERROR: ${e}`));
    }
    start() {
        this.server.listen(80);
    }
    stop() {
        this.server.close();
    }
}
exports.Server = Server;
