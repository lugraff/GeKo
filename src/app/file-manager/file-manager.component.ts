import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html'
})
export class FileManagerComponent implements OnInit {
  codeInput = "";
  secKeyInput = "";
  selectedFileNumber = -1;
  textArea = "";

  constructor(private http: HttpClient, public globals:GlobalsService) {}

  ngOnInit(): void {
    
  }

  onSendCode(){
    if (this.codeInput === ""){
      return;
    }
    
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Api-key", this.codeInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
          this.globals.mainCode = JSON.parse(JSON.stringify(this.codeInput));
          this.globals.fileURLs = JSON.parse(request.responseText);
        };
      };
    };
    request.send();
  }

  onSelectFile(index:number): void {
    this.selectedFileNumber = index;
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bin/"+this.globals.fileURLs[index], true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Security-key", this.secKeyInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        this.textArea = request.responseText;
        console.log(request.responseText);
      };
    };
    request.send();
    console.log("Request");
  }

  onNew(): void {
    if (this.textArea === ""){
      return;
    }
    const request = new XMLHttpRequest();
    request.open("POST", "https://json.extendsclass.com/bin", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Api-key", this.globals.mainCode);
    request.setRequestHeader("Security-key", this.secKeyInput);
    request.setRequestHeader("Private", "true");
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        console.log(request.responseText);
      };
    };
    request.send(this.textArea);
  }

  onDeleteFile(){
    const request = new XMLHttpRequest();
    request.open("DELETE", "https://json.extendsclass.com/bin/"+this.globals.fileURLs[this.selectedFileNumber], true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Security-key", this.secKeyInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        this.globals.fileURLs.slice(this.selectedFileNumber,1);
        console.log(this.globals.fileURLs);
      };
    };
    request.send();
    this.selectedFileNumber = -1;
  }

  onUpdateFile(){
    const request = new XMLHttpRequest();
    request.open("PUT", "https://json.extendsclass.com/bin/:id"+this.globals.fileURLs[this.selectedFileNumber], true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Security-key", this.secKeyInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        console.log(request.responseText);
      };
    };
    request.send(this.textArea);
  }
}

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