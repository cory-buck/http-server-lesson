import * as http from 'http';
import { Logger } from '../log';
import fs from 'fs';

export class Server{

  private server: http.Server;
  private logger: Logger;

  constructor(){
    this.logger = Logger.Create("Server");
    this.server = http.createServer((req, res)=>{
      this.logger.info(`REQUEST: ${req.url}`);
      if(req.url && fs.existsSync("./" + req.url)){
        const contents = fs.readFileSync("./" + req.url);
        res.writeHead(200, { "Content-type": "application/json" });
        res.write(contents);
        res.end();
      }else{
        res.writeHead(404, { "Content-type": "application/json" });
        res.write(JSON.stringify({
          "error": "file not found"
        }));
        res.end();
      }
    });

    this.server.on("connection", (connection)=>{
      this.logger.info(`NEW CONNECTION: ${connection.remoteAddress}`);
    });
    this.server.on("listening", ()=>this.logger.info("LISTENING"));
    this.server.on("close", ()=>this.logger.info("CLOSED"));
    this.server.on("error", (e)=>this.logger.info(`ERROR: ${e}`));
  }


  public start(){
    this.server.listen(80);
  }

  public stop(){
    this.server.close();
  }

}
