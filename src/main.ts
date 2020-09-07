import { Logger } from "./log";
import { Server } from "./server";
import { ConsoleLogger } from "./log/targets";
import { FileLogger } from "./log/targets/file-logger";
import path from 'path';
import { LogLevel } from "./log/log-level";

Logger.AddTarget(new ConsoleLogger());
Logger.AddTarget(new FileLogger(path.join(__dirname, "./logs")));
Logger.SetLevel(LogLevel.TRACE);

const mainLogger = Logger.Create("main");
const server = new Server();

mainLogger.trace("starting up");
mainLogger.debug("starting up");
mainLogger.info("starting up");
mainLogger.warning("starting up");
mainLogger.error("starting up");
server.start();

setTimeout(()=>{
  mainLogger.info("shutting down");
  server.stop();

}, 10000);