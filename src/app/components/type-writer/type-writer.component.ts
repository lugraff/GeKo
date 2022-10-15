import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-type-writer',
  templateUrl: './type-writer.component.html',
})
export class TypeWriterComponent implements OnInit {
  typeText =
    'Mein Name ist Wyron, ich bin 24 Jahre alt, immer noch gut drauf, und das obwohl ich längere Zeit in einem Reiterverein Schulpferd war. Ich sehe, viele von Ihnen rümpfen jetzt schon die Nase. "Schulpferde, das sind doch nur alte Klepper, die zu nichts anderem taugen als Anfänger durch die Gegend zu schaukeln." Einige von Ihnen sehe ich aber auch mitleidig blicken: "Schulpferde, die Armen, jeden Tag andere Reiter, die ihnen im Maul rumreißen. Kein Wunder, dass die abstumpfen."Ja, meine lieben Leser, sicher lässt sich das nicht ganz von der Hand weisen. Aber ich habe das nicht so erfahren. Ich kam in einen Stall, wo auf Schulpferde geachtet wurde. Angenehme Boxen, ausreichend Futter und Stroh, gute Pflege und tierärztliche Versorgung. Ich bin zwar von guter hannoveranischer Abstammung, aber nach Aussage aller meiner Reiter/innen hart wie ein Brett. Mein Rücken "schwingt" nicht, wie es in der Reitersprache so schön heißt. Wahrscheinlich ist das ein Geburtsfehler, denn in meinen ersten Lebensjahren ließ man mich mit der Reiterei so ziemlich in Ruhe. Eigentlich hatte ich ein sehr angenehmes Leben, denn ich durfte die abgesetzten Fohlen auf die Weide begleiten und war so etwas wie ein großer Onkel für sie.Irgendwann aber kam ich dann in den oben beschriebenen Reitstall. Wenn ich ganz ehrlich bin, habe ich mich dort nicht immer von der besten Seite gezeigt und eine Menge Abwürfe zu verzeichnen. Das Komische war nur, es fanden sich immer Reiterinnen, Reitställe werden zu 99% ja von Mädchen besucht, die mich reiten und was noch wichtiger war, die mich pflegen wollten. Ich war zufrieden, führte zwar nicht das Leben eines Pferdestars, dafür brauchte ich aber auch nicht jede Woche auf ein anderes Turnier. Und mal ganz unter uns. So gut geht es den Stars auch nicht. Haben sie Erfolg, werden sie gehätschelt, haben sie keinen, sind ihre Reiter sauer und schieben meistens ihnen den Schwarzen Peter zu. Wie oft haben mir die sogenannten Stars nachts die Ohren voll geweint und ich musste sie dann trösten.Aber nun zu meiner Geschichte. Meine Glückssträhne begann und ist auch bis heute noch nicht abgerissen, als Gabi, damals Anfang 40, beschloss Reiten zu lernen. Sie war gewiss kein Naturtalent, aber sie hatte das Herz am rechten Fleck. Ein Glück für mich, dass ich ihr nicht die Anfänge an der Longe beibringen musste. Vielleicht hätte sie das Handtuch geworfen.Trotzdem wurde sie auf mich aufmerksam und, ich kann es bis heute noch nicht so ganz begreifen, sie verliebte sich in mich. Und aus ihren Gesprächen mit dem Reitlehrer und ihren Freundinnen, die ich manchmal belauschte, hörte ich heraus, dass sie mich gerne besitzen würde. Ihr könnt euch sicherlich vorstellen, wie da mein Pferdeherz schneller schlug.Obwohl ich noch immer Schulpferd war, brachte sie mir kleine Geschenke: besondere Leckereien, ein nobles Stallhalfter, aber vor allem bekam ich Streicheleinheiten ohne Ende.Dann aber passierte etwas Schreckliches. In einer Reitstunde zog ich mir einen Sehnenanriss zu. Ich war verzweifelt. Aus der Traum vom "Privatpferd"!! Wer wollte schon ein Pferd, das monatelang nicht geritten werden kann! Oh Wunder!! Gabi wollte! Sie pflegte mich gesund und von Stund an musste der Schulbetrieb ohne mich auskommen. Ich wurde völlig neu eingekleidet. Ich bin zwar von Natur nicht eitel, aber genossen habe ich es doch.Jetzt hatte ich den Pferdehimmel auf Erden. Gabi verzieh mir alles, auch dass ich sie zwei Mal derbe in den Sand setzte. Im Gegenteil, sie suchte immer wieder die Fehler bei sich, entschuldigte sich sogar bei mir und arbeitete hart an sich, alles richtig zu machen.Aber auch ich musste lernen. Da ich ja nie besonders rittig war, hatte sich bisher kaum jemand gefunden, mich mehr als für den Schulbetrieb nötig, auszubilden. Jetzt übernahm Gabis Freundin unsere gemeinsame Ausbildung. Ehrlich gesagt, um die Aufgabe hab ich sie nicht immer beneidet. Gabi und ich waren zwei harte Nüsse. Doch ihre Geduld hat sich gelohnt. Heute jage ich mit meiner Gabi über die Stoppelfelder, dabei hält sie mich nicht mehr krampfhaft fest, sondern feuert mich sogar noch an. Und das könnt ihr mir glauben: Ich bin mit 24 noch sehr schnell!! Was mich persönlich am meisten wundert, ich habe in meinem hohen Alter noch ein paar Dressurlektionen gelernt und werde nach Aussage meiner beiden Reiterinnen immer r i t t i g e r.Na, wenn das keine bemerkenswerte Pferdelaufbahn ist, dann weiß ich es auch nicht.';
  chars: string[] = [];
  finishedText = '';
  letter: string = '';
  futureText = this.typeText;
  textSideLenght = 42;
  value = 0;
  lastKey: string = '';
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
  constructor() {}

  ngOnInit(): void {
    for (let index = 0; index < this.typeText.length; index++) {
      this.chars.push(this.typeText[index]);
    }
    this.getNextChar();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(key: KeyboardEvent) {
    if (!this.blacklist.includes(key.key)) {
      if (this.letter === key.key) {
        this.finishedText += key.key;
        this.getNextChar();
      } else if (this.lastKey === 'Shift') {
        if (this.letter === key.key.toUpperCase()) {
          this.finishedText += key.key.toUpperCase();
          this.getNextChar();
        }
      } else if (this.letter === '') {
        this.getNextChar();
      }
    }
    this.lastKey = key.key;
  }

  getNextChar() {
    const char = this.futureText.charAt(0);
    if (char !== undefined) {
      this.letter = char;
      this.futureText = this.futureText.substring(1, this.futureText.length);
    }
  }
}
