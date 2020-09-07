import { ServerResponse } from "http";

export class HttpResponse {

  private complete: boolean;
  public get Complete(){ return this.complete; }

  constructor(
    private serverResponse: ServerResponse
  ){
    this.complete = false;
  }

  public unauthorized(){
    if(this.complete) return;
    this.complete = true;
    this.serverResponse.writeHead(400);
    this.serverResponse.end();
  }

  public notFound(){
    if(this.complete) return;
    this.complete = true;
    this.serverResponse.writeHead(404);
    this.serverResponse.end();
  }

  public internalError(){
    if(this.complete) return;
    this.complete = true;
    this.serverResponse.writeHead(500);
    this.serverResponse.end();
  }

  public ok(data?: string){
    if(this.complete) return;
    this.complete = true;
    this.serverResponse.writeHead(200);
    if(!!data) this.serverResponse.write(data);
    this.serverResponse.end();
  }
}