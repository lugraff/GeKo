import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ForumMessage } from 'src/app/interfaces/ForumMessage';
import { GlobalsService } from 'src/app/services/globals.service';
import { JsonAPIService } from 'src/app/services/jsonAPI.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
})
export class ForumComponent implements OnInit, OnDestroy {
  private observSubscription: Subscription;
  forum: ForumMessage[] = [];
  InputMessage = '';
  InputPriority = 0;
  selectedMessageT = 0;
  constructor(
    public globals: GlobalsService,
    public datepipe: DatePipe,
    private jsonApi: JsonAPIService
  ) {
    //TODO interval steuern
    this.observSubscription = interval(9999).subscribe(() => {
      this.onUpdateMessages();
    });
  }
  
  ngOnInit(): void {
    this.onUpdateMessages();
  }

  ngOnDestroy(): void {
    this.observSubscription.unsubscribe();
  }

  onUpdateMessages() {
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/257970cfbb24',
      this.globals.account.groupCode
    );
    result.then((value) => {
      if (value.status === 200) {
        this.forum = JSON.parse(value.responseText);
        this.forum.sort();
        this.forum.sort((a, b) =>
          a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0
        );
      } else {
      }
    });
  }

  onSendMessage() {
    if (this.InputMessage === '') {
      return;
    }
    const currentDateTime = this.datepipe.transform(new Date(), 'E dd H:mm');
    const timestamp = Date.now();
    const newMessage: ForumMessage = {
      name: this.globals.account.name,
      datetime: currentDateTime!,
      timestamp: timestamp,
      message: JSON.parse(JSON.stringify(this.InputMessage)),
      priority: this.InputPriority,
    };
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PATCH',
      '/257970cfbb24',
      this.globals.account.groupCode,
      '',
      'json-patch+json',
      'add',
      '/-',
      JSON.stringify(newMessage)
    );
    result.then((value) => {
      if (value.status === 200) {
        this.forum.push(newMessage);
        this.InputMessage = '';
      } else {
        alert(value.status);
      }
    });
  }

}
