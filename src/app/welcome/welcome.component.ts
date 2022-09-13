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
  constructor(private globals:GlobalsService, private storage:StorageService) { 
    this.codeInput = "";
  }

  ngOnInit(): void {
    
  }

  onSend(){
    const newInput = this.codeInput;
    /*if (!this.codeInput.length){
      this.message = "Gib bitte einen gültigen Code ein.";
      return;
    };*/

    const request = new XMLHttpRequest();
    //request.setRequestHeader("Security-key", newInput);
    request.open("GET", "https://json.extendsclass.com/bin/634eeec6abe0", true);
    request.onreadystatechange = () => {
      this.status = request.status;
      if (request.status === 200){
        this.globals.secCode = newInput;
        this.message = "Login erfolgreich!";
      }else{
        this.message = "Login fehlgeschlagen!";
      };
    };
    request.send();
  }

  onDev(){
    
  }
}