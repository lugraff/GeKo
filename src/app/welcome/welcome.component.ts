import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from '../globals.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  nameInput = "";
  codeInput = "";
  message = "";
  constructor(public globals:GlobalsService, private storage:StorageService, private router:Router) {}

  onKeyup(){
    console.log("event");
  }

  onSend(){
    const newNameInput = this.nameInput;
    const newCodeInput = this.codeInput;
    if (this.codeInput.length <= 1 || this.codeInput.length >= 32){
      this.message = "Gib bitte einen gültigen Namen ein.";
      return;
    };
    if (this.codeInput.length <= 7 || this.codeInput.length >= 17){
      this.message = "Gib bitte einen gültigen Code ein.";
      return;
    };
    

    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bin/"+this.globals.namesUrl, true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
          this.globals.nameEnterUrls = JSON.parse(request.responseText);
          this.LogIn(newNameInput,newCodeInput);
        }else{
          if (request.status === 401){
            this.message = "Unerwarteter Fehler!";
          }else if (request.status === 429){
            this.message = "Seite ist momentan nicht erreichbar. Bitte versuche es später noch einmal...";
          }else if (request.status === 404){
            this.message = "Uri konnte nicht gefunden werden!";
          }else if (request.status === 422){
            this.message = "Fehler, keine Uri-Zieladresse bekannt.";
          }else {
            this.message = "Unbekannter Fehler. Versuche es noch einmal.";
          };
        };
      };
    };
    request.send();
  }

  LogIn(newNameInput:string,newCodeInput:string){
    const checkName = this.globals.nameEnterUrls.enterUrls.find(x => x.name == newNameInput);
    if (checkName === undefined){
      this.message = "Diesem Namen wurde noch kein Account zugewiesen.";
      return;
    };
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bin/"+checkName.uri, true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Security-key", newCodeInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
          this.globals.account = JSON.parse(request.responseText);
          if (this.globals.account.mainCode === ""){
            this.GoToMenu();
          }else{
            this.CheckMainKey();
          }
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

  CheckMainKey(){
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Api-key", this.globals.account.mainCode);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
          this.globals.fileURLs = JSON.parse(request.responseText);
        }else if (request.status === 401){
            alert("Falscher Key!");
            this.globals.account.mainCode = "";
        }else if (request.status === 429){
          alert("FileURLs nicht erreichbar...");
        }else if (request.status === 404){
          alert("FileURLs nicht gefunden!");
        }else if (request.status === 422){
          alert("Fehler, keine Zieladresse bekannt.");
        }else {
          alert("Unbekannter Fehler.");
        };
        this.GoToMenu();
      };
    };
    request.send();
  }
  GoToMenu(){
    this.message = "";
    this.codeInput = "";
    this.router.navigate(['/menu'])
  }
}