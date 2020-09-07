import fs, { WriteStream } from 'fs';
import path from 'path';
import { LogTarget } from "./log-target";

export class FileLogger implements LogTarget {

  private date: Date;
  private file: string; // format: <date>.log
  private stream: WriteStream | null;

  constructor(
    private path: string
  ){
    this.date = new Date();
    this.file = `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}.log`;
    this.stream = null;
  }

  logMessage(label: string, type: string, message: string): void {
    if(this.stream == null){
      if(!fs.existsSync(this.path)) fs.mkdirSync(this.path);
      this.stream = fs.createWriteStream(path.join(this.path, this.file),  { flags: 'a' });
    }
    this.stream.write(`${new Date().toISOString()} ${label} [${type}] ${message}\n`)
  }

}