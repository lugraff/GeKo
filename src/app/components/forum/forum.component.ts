import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ForumMessage } from 'src/app/interfaces/ForumMessage';
import { GlobalsService } from 'src/app/services/globals.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html'
})
export class ForumComponent implements OnInit, OnDestroy {
  private observSubscription : Subscription;
  forum:ForumMessage[] = [];
  InputMessage = "";
  constructor(public globals:GlobalsService, public datepipe: DatePipe) {
    this.observSubscription = interval(9999).subscribe(() => {this.onUpdateMessages()});
   }

  ngOnInit(): void {
    this.onUpdateMessages();
  }

  ngOnDestroy(): void {
    this.observSubscription.unsubscribe();
  }

  onUpdateMessages(){
    console.log("Update");
    const request = new XMLHttpRequest();
    request.open("GET", "https://json.extendsclass.com/bin/257970cfbb24", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Security-key", this.globals.account.groupCode);
    request.onreadystatechange = () => {
      if (request.readyState === 4){
        if (request.status === 200){
          this.forum = JSON.parse(request.responseText);
        }else{

        };
      };
    };
    request.send();
  }

  onSendMessage(){
    const currentDateTime = this.datepipe.transform((new Date), 'MM/dd/yyyy h:mm:ss');
    console.log(currentDateTime);
    const newMessage:ForumMessage = {name:this.globals.account.name,datetime:currentDateTime!,message:JSON.parse(JSON.stringify(this.InputMessage)),priority:0};
    const request = new XMLHttpRequest();
    request.open("PATCH", "https://json.extendsclass.com/bin/257970cfbb24", true);
    request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate, post-check=0, pre-check=0");
    request.setRequestHeader("Pragma", "no-cache");
    request.setRequestHeader("Expires", "0");
    request.setRequestHeader("Security-key", this.globals.account.groupCode);
    request.setRequestHeader("Content-type", "application/json-patch+json");
    request.onreadystatechange = () => {
      if (request.readyState === 4){
          if (request.status === 200){
            this.forum.push(newMessage);
            this.InputMessage = "";
          }else{
            alert(request.status);
          };
        };
      };
    request.send('[{"op":"add","path":"/-","value":'+JSON.stringify(newMessage)+'}]');
  }

}
