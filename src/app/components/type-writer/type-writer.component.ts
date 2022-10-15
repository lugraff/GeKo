import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { TypeWriterFile } from 'src/app/interfaces/TypeWriterFile';
import { GlobalsService } from 'src/app/services/globals.service';
import { JsonAPIService } from 'src/app/services/jsonAPI.service';

@Component({
  selector: 'app-type-writer',
  templateUrl: './type-writer.component.html',
})
export class TypeWriterComponent implements OnInit, OnDestroy {
  selectedFileNumber = -1;
  arcadeMode = false;
  pause = true;
  titel = 'Titel';
  futureText = '';
  finishedText = '';
  letter: string = '';
  textSideLenght = 32;
  value = 0;
  lastKey: string = '';
  lastTimeStamp: number = 0;
  timeTotal: number = 0;
  seconds: string = '00';
  minutes: string = '00';
  hours: string = '00';
  result: string = '';
  score: number = 0;
  interval = 1000;
  blacklist: string[] = [
    'Enter',
    'Control',
    'Meta',
    'Alt',
    'ArrowLeft',
    'ArrowUp',
    'ArrowRight',
    'ArrowDown',
    'Backspace',
    'CapsLock',
  ];
  private observSubscription: Subscription;
  constructor(private jsonApi: JsonAPIService, public globals: GlobalsService) {
    this.observSubscription = interval(this.interval).subscribe(() => {
      if (!this.pause && this.finishedText.length >= 1) {
        this.timeTotal++;
        this.seconds = Math.floor(this.timeTotal % 60)
          .toString()
          .padStart(2, '0');
        this.minutes = Math.floor((this.timeTotal / 60) % 60)
          .toString()
          .padStart(2, '0');
        this.hours = Math.floor((this.timeTotal / 60 / 60) % 24)
          .toString()
          .padStart(2, '0');
      }
    });
  }
  ngOnInit(): void {
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/756c2b2f468b',
      this.globals.account.groupCode
    );
    result.then((value) => {
      if (value.status === 200) {
        this.globals.typeWriterUrls = JSON.parse(value.responseText);
      } else {
        alert(value.status);
      }
    });
  }

  ngOnDestroy(): void {
    this.observSubscription.unsubscribe();
  }

  onNewText(): void {
    this.timeTotal = 0;
    this.finishedText = '';
    this.result = '';
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(key: KeyboardEvent): void {
    if (key.key === 'Enter' && this.futureText.length) {
      this.pause = !this.pause;
    }
    if (this.pause) {
      return;
    }
    if (!this.blacklist.includes(key.key)) {
      if (this.letter === key.key) {
        this.finishedText += key.key;
        this.getNextChar();
      } else if (
        this.lastKey === 'Shift' &&
        this.lastTimeStamp > key.timeStamp - 100
      ) {
        if (this.letter === key.key.toUpperCase()) {
          this.finishedText += key.key.toUpperCase();
          this.getNextChar();
        }
      } else if (this.letter === '') {
        this.getNextChar();
      }
    }
    this.lastKey = key.key;
    this.lastTimeStamp = key.timeStamp;
  }

  getNextChar(): void {
    if (this.futureText.length <= 1) {
      this.finishedRound();
    } else {
      const char = this.futureText.charAt(0);
      if (char !== undefined) {
        this.letter = char;
        this.futureText = this.futureText.substring(1, this.futureText.length);
      }
    }
  }

  finishedRound(): void {
    this.pause = true;
    if (this.hours !== '00') {
      this.result =
        this.hours +
        ':' +
        this.minutes +
        ':' +
        this.seconds +
        '  Score: ' +
        this.score;
    } else {
      this.result =
        this.minutes + ':' + this.seconds + '  Score: ' + this.score;
    }
    this.finishedText = '';
    this.futureText = '';
    this.letter = '';
    this.timeTotal = 0;
    this.seconds = '00';
    this.minutes = '00';
    this.hours = '00';
  }

  onSelectTitel(index: number): void {
    this.selectedFileNumber = index;
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/' + this.globals.typeWriterUrls[index].url,
      this.globals.account.groupCode
    );
    result.then((value) => {
      if (value.status === 200) {
        console.log(value);
        const typeWriterFile: TypeWriterFile = JSON.parse(value.responseText);
        this.futureText = typeWriterFile.text;
        this.titel = typeWriterFile.titel;
      } else {
        alert(value.status);
      }
    });
  }
}

//TODO
/*
Score JsonFile:
[user:[timestamps],score]

-User können neue Texte erstellen
-Dev kann Texte löschen

-Genre->Text Auswählen
-Am Ende Bestätigen dass Score aufgenommen wird...
-Write Json Score
*/
