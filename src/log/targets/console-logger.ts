import { LogTarget } from "./log-target";

export class ConsoleLogger implements LogTarget{

  logMessage(label: string, type: string, message: string){
    console.log(`${new Date().toISOString()} ${label} [${type}] ${message}`)
  }

}