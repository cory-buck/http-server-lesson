import { LogTarget } from "./targets";
import { LogLevel } from "./log-level";

/**
 *  
 */
export  class Logger {

  private static logTargets: LogTarget[]  = [];
  private static level: LogLevel = LogLevel.INFO;

  public static AddTarget(target: LogTarget){
    this.logTargets.push(target);
  }

  public static RemoveTarget(target: LogTarget){
    this.logTargets = this.logTargets.filter(t=>t !== target);
  }

  public static Create(label: string){
    return new Logger(label);
  }

  public static SetLevel(level: LogLevel){
    this.level = level;
  }

  private constructor(
    private label: string
  ){  }


  /**
   * 
   * @param message 
   */
  public trace(message: string){
    if(Logger.level > LogLevel.TRACE) return;
    Logger.logTargets.forEach(target=>target.logMessage(this.label, "TRACE", message));
  }

  /**
   * Log a debug message.
   * @param message The message you want logged.
   */
  public debug(message: string){
    if(Logger.level > LogLevel.DEBUG) return;
    Logger.logTargets.forEach(target=>target.logMessage(this.label, "DEBUG", message));
  }

  public info(message: string){
    if(Logger.level > LogLevel.INFO) return;
    Logger.logTargets.forEach(target=>target.logMessage(this.label, "INFO", message));
  } 

  public warning(message: string){
    if(Logger.level > LogLevel.WARNING) return;
    Logger.logTargets.forEach(target=>target.logMessage(this.label, "WARNING", message));
  } 

  public error(message: string){
    if(Logger.level > LogLevel.ERROR) return;
    Logger.logTargets.forEach(target=>target.logMessage(this.label, "ERROR", message));
  } 


}