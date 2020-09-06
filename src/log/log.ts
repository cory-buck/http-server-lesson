export  class Log {

  constructor(
    private label: string
  ){ }

  public i(message: string){
    this.logMessage("INFO", message);
  } 

  public e(message: string){
    this.logMessage("ERROR", message);
  } 

  public w(message: string){
    this.logMessage("WARNING", message);
  } 

  private logMessage(type: string, message: string){
    console.log(`${new Date().toISOString()} ${this.label} [${type}] ${message}`)
  }
}