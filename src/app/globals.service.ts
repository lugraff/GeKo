import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  fileURLs:string[] = [];
  secCode:string = "";
  //constructor() { }
}