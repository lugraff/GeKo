import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { NewFileResponse } from 'src/app/interfaces/NewFileResponse';
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
  titel = '';
  futureText = '';
  finishedText = '';
  letter: string = '';
  textSideLength = 32;
  lastKey: string = '';
  lastTimeStamp: number = 0;
  timeTotal: number = 0;
  seconds: string = '00';
  minutes: string = '00';
  hours: string = '00';
  result: string = '';
  score: number = 0;
  interval = 1000;
  minChars = 100;
  genre = '';
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
    this.score = 0;
    this.seconds = '00';
    this.minutes = '00';
    this.hours = '00';
    this.finishedText = '';
    this.futureText = '';
    this.letter = '';
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
      } else {
        this.score -= 1;
      }
    }
    this.lastKey = key.key;
    this.lastTimeStamp = key.timeStamp;
  }

  getNextChar(): void {
    if (this.futureText.length <= 0) {
      this.finishedRound();
    } else {
      if (this.finishedText.length <= 1) {
        this.futureText = this.futureText.replace(/\n|\r/g, '');
      }
      const char = this.futureText.charAt(0);
      if (char !== undefined) {
        this.letter = char;
        this.futureText = this.futureText.substring(1, this.futureText.length);
      }
    }
  }

  finishedRound(): void {
    this.pause = true;
    this.score +=
      this.finishedText.length +
      (this.finishedText.length / this.timeTotal) * 100;
    if (this.hours !== '00') {
      this.result =
        this.hours +
        ':' +
        this.minutes +
        ':' +
        this.seconds +
        '  Score: ' +
        Math.round(this.score);
    } else {
      this.result =
        this.minutes +
        ':' +
        this.seconds +
        '  Score: ' +
        Math.round(this.score);
    }
    this.timeTotal = 0;
    this.seconds = '00';
    this.minutes = '00';
    this.hours = '00';
    this.finishedText = '';
    this.futureText = '';
    this.letter = '';
    //TODO Score berechnen, Zeiten Schreiben, HTTP-Post, frage ob post..., ZeichenAnzahl zeigen und Total, Score Bonus bei keinem Fehler,
  }

  onSelectTitel(index: number): void {
    this.onNewText();
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
        this.genre = typeWriterFile.genre;
      } else {
        alert(value.status);
      }
    });
  }

  onSaveNewText(): void {
    if (this.titel === '') {
      alert('W??hle einen Titel!');
      return;
    }
    if (this.genre === '') {
      alert('W??hle einen Genre!');
      return;
    }
    if (this.futureText.length < this.minChars) {
      alert(
        'Der Text muss mindestens ' + this.minChars + ' Zeichen lang sein!'
      );
      return;
    }
    const newText: TypeWriterFile = {
      titel: this.titel,
      genre: this.genre,
      text: this.futureText,
    };
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'POST',
      '',
      this.globals.account.groupCode,
      this.globals.account.mainCode,
      '',
      '',
      '',
      '',
      'true',
      JSON.stringify(newText)
    );
    result.then((value) => {
      if (value.status === 201) {
        const responseObj: NewFileResponse = JSON.parse(value.responseText);
        this.globals.typeWriterUrls.push({
          titel: this.titel,
          genre: this.genre,
          letterCount: this.futureText.length,
          url: responseObj.id,
          scoreUrl: '???',
        });
        this.selectedFileNumber = this.globals.typeWriterUrls.length - 1;
        setTimeout(() => this.addFileUrl(), 333);
      } else {
        alert(value.status);
      }
    });
  }
  addFileUrl(): void {
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PUT',
      '/756c2b2f468b',
      this.globals.account.groupCode,
      '',
      '',
      '',
      '',
      '',
      '',
      JSON.stringify(this.globals.typeWriterUrls)
    );
    result.then((value) => {
      if (value.status === 200) {
        alert('Neue Datei erstellt.');
      } else if (value.status === 401) {
        alert('Falscher Security Code!');
      } else if (value.status === 429) {
        alert('Abruflimit ??berschritten!');
      } else if (value.status === 413) {
        alert('Datei zu gro??!');
      } else {
        alert(value.status);
      }
    });
  }

  onDeleteText(): void {
    if (this.selectedFileNumber < 0) {
      alert('W??hle zuerst eine Datei!');
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'DELETE',
      '/' + this.globals.typeWriterUrls[this.selectedFileNumber].url,
      this.globals.account.groupCode
    );
    result.then((value) => {
      if (value.status === 200) {
        setTimeout(() => this.deleteFileURL(), 333);
      } else {
        alert(value.status);
      }
    });
  }
  deleteFileURL(): void {
    let fileIndex = -1;
    for (let index = 0; index < this.globals.typeWriterUrls.length; index++) {
      if (
        this.globals.typeWriterUrls[index].url ===
        this.globals.typeWriterUrls[this.selectedFileNumber].url
      ) {
        fileIndex = index;
        break;
      }
    }
    if (fileIndex === -1) {
      alert('Pfad nicht gefunden.');
      return;
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PATCH',
      '/756c2b2f468b',
      this.globals.account.groupCode,
      '',
      'json-patch+json',
      'remove',
      '/',
      fileIndex.toString()
    );
    result.then((value) => {
      if (value.status === 200) {
        this.globals.typeWriterUrls.splice(this.selectedFileNumber, 1);
        this.selectedFileNumber = -1;
        this.futureText = '';
        this.titel = '';
        this.genre = '';
        alert('Datei gel??scht.');
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

-User k??nnen neue Texte erstellen-> geht nur wenn sie zuvor von Dev erstellt wurden.

-Genre->Text Ausw??hlen
*/
