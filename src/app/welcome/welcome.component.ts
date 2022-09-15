import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from '../globals.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  codeInput = "";
  message = "";
  constructor(public globals:GlobalsService, private storage:StorageService, private router:Router) {}

  onSend(){
    const newInput = this.codeInput;
    if (this.codeInput.length <= 7 || this.codeInput.length >= 17){
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
          if (request.status === 401){
            this.message = "Falscher Code! Versuche es noch einmal.";
          }else if (request.status === 429){
            this.message = "Seite ist momentan nicht erreichbar. Bitte versuche es später noch einmal...";
          }else if (request.status === 404){
            this.message = "Seite konnte nicht gefunden werden!";
          }else if (request.status === 422){
            this.message = "Fehler, keine Zieladresse bekannt.";
          }else {
            this.message = "Unbekannter Fehler. Versuche es noch einmal.";
          };
        };
      };
      
    };
    request.send();
  }

  CheckKey(key:string){
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Api-key", key);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
          this.globals.mainCode = JSON.parse(JSON.stringify(key));
          this.globals.fileURLs = JSON.parse(request.responseText);
          this.codeInput = "";
          this.message = "";
          this.router.navigate(['/menu'])
        }else if (request.status === 401){
            this.message = "Falscher Code! Versuche es noch einmal.";
        }else if (request.status === 429){
          this.message = "Seite ist momentan nicht erreichbar. Bitte versuche es später noch einmal...";
        }else if (request.status === 404){
          this.message = "Seite konnte nicht gefunden werden!";
        }else if (request.status === 422){
          this.message = "Fehler, keine Zieladresse bekannt.";
        }else {
          this.message = "Unbekannter Fehler. Versuche es noch einmal.";
        };
        
      };
    };
    request.send();
  }
}