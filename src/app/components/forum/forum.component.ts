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
  updateCounter = 0;
  loading = false;
  interval = 9000;
  placeholder = 'neue Nachricht...';
  constructor(
    public globals: GlobalsService,
    public datepipe: DatePipe,
    private jsonApi: JsonAPIService
  ) {
    this.observSubscription = interval(this.interval).subscribe(() => {
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
    this.loading = true;
    this.updateCounter += 1;
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/257970cfbb24',
      this.globals.account.groupCode
    );
    result.then((value) => {
      if (value.status === 200) {
        const newForum: ForumMessage[] = JSON.parse(value.responseText);
        if (this.forum !== newForum) {
          this.interval = 5000;
          this.forum = newForum;
          this.forum.sort();
          this.forum.sort((a, b) =>
            a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0
          );
        } else {
          if (this.interval < 15000) {
            this.interval += 1000;
          }
        }
      }
      this.loading = false;
    });
  }

  onSendMessage() {
    if (this.InputMessage === '') {
      return;
    }
    this.loading = true;
    let timestamp = Date.now();
    if (this.selectedMessageT !== 0) {
      timestamp = this.selectedMessageT;
    }
    const currentDateTime = this.datepipe.transform(new Date(), 'E dd H:mm');
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
      this.loading = false;
    });
  }

  onMessageClick(
    timestamp: number,
    message: string,
    menuPointRef: HTMLElement
  ) {
    if (timestamp === this.selectedMessageT) {
      this.selectedMessageT = 0;
      this.placeholder = 'neue Nachricht...';
    } else {
      this.selectedMessageT = timestamp;
      this.placeholder = 'Antworten auf... ' + message;
    }
    menuPointRef.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'center',
    });
  }
}
