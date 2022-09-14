import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  codeInput = "";
  status = -1;
  message = "";
  constructor(public globals:GlobalsService, private storage:StorageService) { 
    this.codeInput = "";
  }

  ngOnInit(): void {
    
  }

  onSend(){
    const newInput = this.codeInput;
    if (!this.codeInput.length){
      this.message = "Gib bitte einen gültigen Code ein.";
      return;
    };
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bin/0c2051164719", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Security-key", newInput);
    request.onreadystatechange = () => {
      console.log(request.readyState);
      if (request.readyState === 4){
        if (request.status === 200){
          this.globals.secCode = newInput;
          this.CheckKey(request.responseText);
        }else{
          this.message = "Login fehlgeschlagen!";
        };
      }
      
    };
    request.send();
  }

  CheckKey(key:string){
    //await new Promise(f => setTimeout(f, 1000));
    console.log("Start")
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    console.log(key)
    request.setRequestHeader("Api-key", key);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        console.log(request.readyState);
        if (request.status === 200){
          this.status = request.status;
          this.globals.mainCode = JSON.parse(JSON.stringify(key));
          this.globals.fileURLs = JSON.parse(request.responseText);
          this.message = "Login erfolgreich!";
          console.log("Succses");
        }else{
          console.log("Fail");
        };
      };
    };
    request.send();
  }
}