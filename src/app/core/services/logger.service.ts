import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(msg:string){
    console.log("Level Log:" + new Date() + ": " + JSON.stringify(msg))
  }

  error(msg:string){
    console.error("Level error:" + new Date() + ": " + JSON.stringify(msg))
  }

}
