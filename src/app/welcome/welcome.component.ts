import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  codeInput = "";
  textInput = "";
  result = "";
  status = -1;
  constructor() { }

  ngOnInit(): void {
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.onreadystatechange = () => {
      console.log(request.status);
      this.status = request.status;
      if (request.status === 200){
        this.result = request.responseText;
      };
    };
    request.send();
  }

  onSend(){
    //console.log(this.codeInput);
    //console.log(this.textInput);
    

    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Api-key", this.codeInput);
    request.onreadystatechange = () => {
      this.result = request.responseText;
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