import * as http from 'http';
import { Log } from '../log';
import fs from 'fs';

export class Server{

  private server: http.Server;
  private logger: Log;

  constructor(){
    this.logger = new Log("Server");
    this.server = http.createServer((req, res)=>{
      this.logger.i(`REQUEST: ${req.url}`);
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

    this.server.on("connection", ()=>this.logger.i("NEW CONNECTION"));
    this.server.on("listening", ()=>this.logger.i("LISTENING"));
    this.server.on("close", ()=>this.logger.i("CLOSED"));
    this.server.on("error", (e)=>this.logger.i(`ERROR: ${e}`));
  }


  public start(){
    this.server.listen(80);
  }

  public stop(){
    this.server.close();
  }

}
