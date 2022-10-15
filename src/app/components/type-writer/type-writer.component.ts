import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-type-writer',
  templateUrl: './type-writer.component.html',
})
export class TypeWriterComponent implements OnInit {
  typeText = "WhatsApp: Sicherheitslücke ermöglicht Zugriff auf das Smartphone. Kürzlich gab die Betreibergesellschaft von WhatsApp eine neue Sicherheitslücke bekannt, bei der Hacker das Smartphone übernehmen können. Die Betreibergesellschaft von WhatsApp hat Ende September eine Sicherheitslücke veröffentlicht, die man ausnutzen konnte, indem man dem Empfänger ein speziell präpariertes Video geschickt oder einen Videoanruf mit ihm durchgeführt hat. Daraufhin war die Kontrolle des angerufenen Gerätes möglich. Auch hätte man danach unabhängig vom Betriebssystem alle Dateien des Smartphones kopieren können.";
  chars: string[] = [];
  finishedText = '';
  letter: string = '';
  futureText = this.typeText;
  blacklist: string[] = [
    'Enter',
    'Shift',
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
  constructor() {}

  ngOnInit(): void {
    for (let index = 0; index < this.typeText.length; index++) {
      this.chars.push(this.typeText[index]);
    }
    this.getNextChar();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(key: KeyboardEvent) {
    console.log(key);
    if (!this.blacklist.includes(key.key)) {
      if (this.letter === key.key) {
        this.finishedText += key.key;
        this.getNextChar();
      } else if (this.letter === '') {
        this.getNextChar();
      }
    }
  }



  getNextChar() {
    const char = this.futureText.charAt(0);
    if (char !== undefined) {
      this.letter = char;
      this.futureText = this.futureText.substring(1, this.futureText.length);
    }
  }
}
