export interface LogTarget {    
  logMessage(label: string, type: string, message: string): void;
}