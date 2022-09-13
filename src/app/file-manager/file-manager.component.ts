import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { delay, Observable } from 'rxjs';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html'
})
export class FileManagerComponent implements OnInit {
  keyTrue = "";
  codeInput = "";
  fileURLs = [];
  //files = ["A","Test"];
  result = "ø";


  constructor(private http: HttpClient) {
   }

  ngOnInit(): void {
    
  }

  onSendCode(){
    if (this.codeInput === ""){
      return;
    }
    
    let counter = 2;
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Api-key", this.codeInput);
    request.onreadystatechange = () => {
      counter -= 1;
      if (request.status === 200 && counter === 0){
        this.keyTrue = JSON.parse(JSON.stringify(this.codeInput));
        this.fileURLs = JSON.parse(request.responseText);
      };
    };
    request.send();
  }

  onSelectFile(index:number): void {
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bin/"+this.fileURLs[index], true);
    request.setRequestHeader("Security-key", "wg");
    request.onreadystatechange = () => {
      this.result = request.responseText;
      console.log(request.responseText);
    };
    request.send();
    console.log("Request");
  }

  onNew(): void {


    const request = new XMLHttpRequest();
    request.open("POST", "https://json.extendsclass.com/bin", true);
    request.setRequestHeader("Api-key", "49f8f2a5-e8c2-11ec-b943-0242ac110002");
    request.setRequestHeader("Security-key", "wg");
    request.setRequestHeader("Private", "true");
    request.onreadystatechange = () => {
      console.log(request.responseText);
    };
    request.send('{"name": "main","urlList":[]}');
/*
    console.log("KEY:" + "");

    const request = new XMLHttpRequest();
    request.open("POST", "https://json.extendsclass.com/bin", true);
    request.setRequestHeader("Api-key", "");
    request.onreadystatechange = () => {
      console.log(request.responseText)
    };
    request.send('{"name": "my JSON Test"}');
  }
  /*
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.onreadystatechange = () => {
      this.status = request.status;
      if (request.status === 200){
        this.globals.fileURLs = JSON.parse(request.responseText);
        this.message = "Login erfolgreich!";
      };
    };
    request.send();
    
    
    
    */
  }
}
