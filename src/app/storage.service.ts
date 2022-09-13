import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


  getIds(userInput:string): string[]{
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Api-key", userInput);
    request.onreadystatechange = () => {
      //this.globals.fileURLs = JSON.parse(request.responseText);
      
    };
    request.send();
    return JSON.parse(request.responseText);
}
}
