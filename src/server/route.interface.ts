import { Middleware } from "./middleware";
import { Dictionary } from "./dictionary";

export interface RegexRoute {
  regex: RegExp;
  middleware: Middleware;
}

export interface Route {
  fullPath: string;
  subroutes: Dictionary<Route>;
  middleware: Middleware[];
}