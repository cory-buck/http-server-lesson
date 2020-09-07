import { IncomingMessage } from "http";

export class HttpRequest {


  public get method(){ return this._method; }

  public get url(){ return this._url; }

  public get params(){ return this._params; }
  
  public get body(){ return this._body; }


  constructor(
    private _method: string,
    private _url: string,
    private _params: { [key:string]: string | null },
    private _body: string
  ){
    
  }

}