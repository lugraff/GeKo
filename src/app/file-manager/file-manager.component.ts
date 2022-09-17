import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { Account } from '../interfaces/Account';
import { NewFileResponse } from "../interfaces/NewFileResponse";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html'
})
export class FileManagerComponent implements OnInit {
  codeInput = "";
  securityInput = "";
  privateInput = false;
  nameInput = "";
  getMainKey = false;
  selectedFileNumber = -1;
  textArea = "";

  constructor(public globals:GlobalsService) {}

  ngOnInit(): void {
    
  }

  onSendCode(){
    if (this.codeInput.length !== 36){
      alert("Falscher Code!");
      return;
    };
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bins", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Api-key", this.codeInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
          this.globals.account.mainCode = JSON.parse(JSON.stringify(this.codeInput));
          this.globals.fileURLs = JSON.parse(request.responseText);
          this.codeInput = "";
        
        }else{
          alert(request.status);
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
    request.setRequestHeader("Security-key", this.securityInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        this.textArea = request.responseText;
      };
    };
    request.send();
  }

  newAccount(): void {
    const securityCode = this.securityInput;
    let mainkey = "";
    if (this.getMainKey){
      mainkey = this.globals.account.mainCode;
    }
    const newAccount:Account = {name:this.nameInput,mainCode:mainkey};
    const request = new XMLHttpRequest();
    request.open("POST", "https://json.extendsclass.com/bin", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Api-key", this.globals.account.mainCode);
    request.setRequestHeader("Security-key", securityCode);
    request.setRequestHeader("Private", this.getPrivateAsString());
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 201){
          const responseObj:NewFileResponse = JSON.parse(request.responseText);
          this.globals.fileURLs.push(responseObj.id);
          this.selectedFileNumber = this.globals.fileURLs.length - 1;
          setTimeout(() => this.ActivateAccount(newAccount,responseObj), 1000);
        }else{
          alert(request.status);
        };
      };
    };
    request.send(JSON.stringify(newAccount));
  }

  ActivateAccount(newAccount:Account,responseObj:NewFileResponse) :void {
    console.log("Start Aktivate");
    const request = new XMLHttpRequest();
    request.open("PATCH", "https://json.extendsclass.com/bin/"+this.globals.namesUrl, true);
    request.setRequestHeader("Content-type", "application/json-patch+json");
    request.onreadystatechange = () => {
      alert(request.status);
      console.log(request.responseText);
    };
    request.send('[{"op":"add","path":"/enterUrls","value":[{"name":"'+newAccount.name+'", "uri":"'+responseObj.id+'"},{"name":"'+newAccount.name+'", "uri":"'+responseObj.id+'"}]}]');
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
    request.setRequestHeader("Api-key", this.globals.account.mainCode);
    request.setRequestHeader("Security-key", this.securityInput);
    request.setRequestHeader("Private", this.getPrivateAsString());
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 201){
          const responseObj:NewFileResponse = JSON.parse(request.responseText);
          this.globals.fileURLs.push(responseObj.id);
          this.selectedFileNumber = this.globals.fileURLs.length - 1;
        }else{
          alert(request.status);
        };
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
    request.setRequestHeader("Security-key", this.securityInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
        this.globals.fileURLs.splice(this.selectedFileNumber,1);
        this.selectedFileNumber = -1;
        this.textArea = "";
        }else{
        alert(request.status);
        };
      };
    };
    request.send();
  }

  onUpdateFile(){
    const request = new XMLHttpRequest();
    request.open("PUT", "https://json.extendsclass.com/bin/"+this.globals.fileURLs[this.selectedFileNumber], true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Security-key", this.securityInput);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
          alert("file updated");
        }else if (request.status === 401){
          alert("Falscher Security Code!");
        }else if (request.status === 429){
          alert("exceeded the call limit!");
        }else if (request.status === 413){
          alert("file too large!");
        }else{
          alert(request.status);
        };
      };
    };
    request.send(this.textArea);
  }

  getPrivateAsString() :string {
    if (this.privateInput){
      return "true";
    };
    return "false";
  }
}
