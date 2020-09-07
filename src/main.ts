import { Logger } from "./log";
import { HttpServer } from "./server";
import { ConsoleLogger } from "./log/targets";
import { FileLogger } from "./log/targets/file-logger";
import path from 'path';
import { LogLevel } from "./log/log-level";

Logger.AddTarget(new ConsoleLogger());
Logger.AddTarget(new FileLogger(path.join(__dirname, "../logs")));
Logger.SetLevel(LogLevel.DEBUG);

const logger = Logger.Create("main");
const server = new HttpServer(80, Logger.Create(HttpServer.name));
server.use(/^.+$/, (req, res, next)=>{
  logger.info(`Request: ${req.url}`);
  next();
});
server.use("/hello-world", (req, res, next)=>{
  logger.info("HELLO WORLD CALLED");
  res.ok("Hello World!");
});
server.get("/hello-cory", (req, res)=>res.ok("Hello Cory!"));

logger.info("starting up");
server.listen(()=>{
  logger.info("started");
});

process.on("SIGINT", ()=>server.close());