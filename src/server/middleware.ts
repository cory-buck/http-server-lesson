import { IncomingMessage, ServerResponse } from "http";
import { HttpResponse } from "./http-response";
import { HttpRequest } from "./http-request";

export type Middleware = (req: HttpRequest, res: HttpResponse, next: ()=>void)=>void;