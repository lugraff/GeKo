import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  codeInput = "";
  result = "";
  status = -1;
  message = "";
  constructor() { }

  ngOnInit(): void {
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.onreadystatechange = () => {
      this.status = request.status;
      if (request.status === 200){
        this.result = request.responseText;
        this.message = "Login erfolgreich!";
      };
    };
    request.send();
  }

  onSend(){
    if (!this.codeInput.length){
      this.message = "Gib bitte einen gültigen Code ein.";
      return;
    };

    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Api-key", this.codeInput);
    request.onreadystatechange = () => {
      this.status = request.status;
      if (request.status === 200){
        this.result = request.responseText;
        this.message = "Login erfolgreich!";
      }else{
        this.message = "Login fehlgeschlagen!";
      };
    };
    request.send();
    
/*
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bin/"+this.codeInput, true);
    request.onreadystatechange = () => {
      this.result = request.responseText;
    };
    request.send();
*/
  }
}