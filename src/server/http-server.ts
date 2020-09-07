import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { Logger } from '../log';
import { Socket } from 'net';
import { RequestHandler } from './request-handler';
import { Middleware } from './middleware';
import { Dictionary } from './dictionary';
import { Route, RegexRoute } from './route.interface';
import { HttpResponse } from './http-response';
import { HttpRequest } from './http-request';

export class HttpServer{

  private server: Server;

  private open: boolean;
  public get Open(){
    return this.open;
  }

  private middleware: Middleware[]; 
  private route: Route;
  private regex: RegexRoute[];

  constructor(
    private port: number,
    protected logger: Logger
  ){
    this.open = false;
    this.middleware = [ ];
    this.route = { fullPath: "/", subroutes: {}, middleware: [] };
    this.regex = [];
    this.server = createServer((req, res)=>this.handleRequest(req, res));
    this.server.on("listening", ()=>this.onListening());
    this.server.on("connection", (connection)=>this.onConnection(connection));
    this.server.on("error", (e)=>this.onError(e));
    this.server.on("close", ()=>this.onClose());    
  }

  public listen(callback?: ()=>void){
    this.logger.info("Starting...");
    this.server.listen(this.port, callback);
  }

  public close(){
    this.logger.info("Stopping...");
    this.server.close((e)=>{
      if(!!e) this.onError(e);
    });
  }

  protected onListening(){
    this.open = true;
    this.logger.info(`Listening on port: ${this.port}`)
  }

  protected onConnection(connection: Socket){
    this.logger.info(`Connection Established: ${connection.remoteAddress}`);
  }

  protected onError(error: Error){
    this.logger.error(`An error occurred: ${error.message}${error.stack ? error.stack + "\n" : ""}`);
  }

  protected onClose(){
    this.open = false;
    this.logger.info("...Closed.");
  }


  private handleMiddleware(req: HttpRequest, res: HttpResponse, middleware: Middleware[]){
    this.logger.debug(`Handling ${middleware.length} middleware.`);
    const next = middleware.shift();
    if(!next) return;
    this.logger.debug("Handling middleware");
    next(req, res, ()=>{
      this.logger.debug("Next called");
      this.handleMiddleware(req, res, middleware);
    });
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse){
    
    const url = !!req.url 
      ? req.url
        .split("?")[0] 
      : "/";

    const params: { [key:string]: string | null } = !!req.url 
      ? req.url
        .split("?")
        .reduce((value: { [key:string]: string | null }, nextValue, idx)=>{
          if(idx == 1){
            nextValue
              .split("&")
              .map(s=>s.split("="))
              .forEach((kv: string[])=>{
                value[kv[0]] = kv.length == 2 ? kv[1] : null;
              });
          }
          return value;
        }, {})
      : {};

    const body: Buffer[] = [];

    req.on("data", (data)=>{
      body.push(data);
    }).on("end", ()=>{
      this.routeRequest(new HttpRequest(req.method || "GET", url, params, Buffer.concat(body).toString()),new HttpResponse(res));
    });

  }

  private routeRequest(req: HttpRequest, res: HttpResponse){
    this.logger.debug(`Routing Request: ${req.url}`);
    const path = req.url ? req.url : "/";
    // split url path into individual chunks
    const chunks = path.split("/").filter(c=>c !== "");
    // middleware to execute
    const middleware = [ ...this.middleware ];
    // add regex middleware
    for(let i = 0; i < this.regex.length; i++){
      this.logger.debug(`Testing Regex: ${this.regex[i]}`);
      if(this.regex[i].regex.test(path)){
        middleware.push(this.regex[i].middleware);
      }else this.logger.debug("No match");
    }    
    // add route middleware
    let route: Route = this.route;
    let found = false;
    // iterate through route tree until end of path chunks
    for(let i = 0; i < chunks.length; i++){
      const subroutes = Object.keys(route.subroutes);
      const key = `[${req.method}]${chunks[i]}`;
      this.logger.info("CHECKING FOR PATH MATCHES: " + key);
      found = false;
      for(let k = 0; k < subroutes.length; k++){
        this.logger.info("SUBROUTE PATH REGEX: " + subroutes[k]);
        if(new RegExp(subroutes[k]).test(key)){
          route = route.subroutes[subroutes[k]];
          found = true;
          break;
        }
      }
      if(!found) break;

      // if end of route chunks, then add middleware
      if(i == chunks.length - 1 && route.middleware.length > 0){
        this.logger.debug(`Found Route: ${route.fullPath}`);
        middleware.push(...route.middleware);
      }
    }
    this.handleMiddleware(req, res, middleware);
    if(!res.Complete) res.notFound();
  }




  public use(pathRegexOrMiddleware: RegExp | string | Middleware, middleware?: Middleware){
    this.logger.info("USING => " + pathRegexOrMiddleware + ":" + JSON.stringify(middleware));
    if(typeof(pathRegexOrMiddleware) === "string" && typeof(middleware) === "function"){
      this.addPathMiddleware(["GET","POST","PUT","DELETE"], pathRegexOrMiddleware, middleware);
    }else if(pathRegexOrMiddleware instanceof RegExp && typeof(middleware) === "function"){
      this.addRegexMiddleware(pathRegexOrMiddleware, middleware);
    }else if(typeof(pathRegexOrMiddleware) === "function"){
      this.addMiddleware(pathRegexOrMiddleware);
    }else {
      throw new Error("Invalid parameters");
    }
  }

  private addPathMiddleware(methods: string[], path: string, middleware: Middleware){
    this.logger.info("ADDING PATH MIDDLEWARE" + JSON.stringify(middleware));
    
    const chunks = path.split("/").filter(c=>c !== "");
    let route: Route = this.route;
    chunks.forEach((c, i)=>{
      const key = `^\\[(${methods.join("|")})\\]${c}$`;
      if(Object.keys(route.subroutes).indexOf(c) < 0){
        route.subroutes[key] = {
          fullPath: chunks.filter((v, ci)=>ci <= i).join("/"),
          subroutes: {},
          middleware: []
        }
      }
      route = route.subroutes[key];
    });
    route.middleware.splice(0, 0, middleware);
    this.logger.info(JSON.stringify(route.middleware));
  }

  private addRegexMiddleware(regex: RegExp, middleware: Middleware){
    this.regex.push({ regex, middleware });
  }

  private addMiddleware(middleware: Middleware){
    this.middleware.splice(0, 0, middleware);
  }


  public get(path: string, middleware: Middleware){
    this.addPathMiddleware(["GET"], path, middleware);
  }

  public post(path: string, middleware: Middleware){
    this.addPathMiddleware(["POST"], path, middleware);
  }

  public put(path: string, middleware: Middleware){
    this.addPathMiddleware(["PUT"], path, middleware);
  }

  public delete(path: string, middleware: Middleware){
    this.addPathMiddleware(["DELETE"], path, middleware);
  }
  

}
