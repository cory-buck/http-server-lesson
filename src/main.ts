import { Log } from "./log";
import { Server } from "./server";

const mainLogger = new Log("main");
const server = new Server();

mainLogger.i("starting up");
server.start();

setTimeout(()=>{
  mainLogger.i("shutting down");
  server.stop();

}, 10000);