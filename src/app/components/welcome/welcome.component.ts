import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from '../../services/globals.service';
import { Savefile } from '../../interfaces/Savefile';
import { JsonAPIService } from 'src/app/services/jsonAPI.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent implements OnInit {
  nameInput = '';
  codeInput = '';
  message = '';
  saveCode = false;
  constructor(
    public globals: GlobalsService,
    private router: Router,
    private jsonApi: JsonAPIService
  ) {}

  ngOnInit(): void {
    if (this.globals.account.name !== '') {
      return;
    }
    const savefile = localStorage.getItem('save');
    if (savefile === null) {
      return;
    } else {
      const result: Savefile = JSON.parse(savefile);
      this.nameInput = result.name;
      this.codeInput = result.code;
      if (this.codeInput !== '') {
        this.onSend();
      }
    }
  }

  onSend() {
    const newNameInput = this.nameInput;
    const newCodeInput = this.codeInput;
    if (this.nameInput.length <= 1 || this.nameInput.length >= 32) {
      this.message = 'Gib bitte einen gültigen Namen ein.';
      return;
    }
    if (newNameInput === 'Dev') {
      this.router.navigate(['./menu/file-manager']);
      return;
    }
    if (this.codeInput.length <= 7 || this.codeInput.length >= 17) {
      this.message = 'Gib bitte einen gültigen Code ein.';
      return;
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/' + this.globals.namesUrl
    );
    result.then((value) => {
      const result = JSON.parse(value.responseText);
      this.globals.nameEnterUrls = result;
      this.globals.forumUrl = result['forum'];
      this.LogIn(newNameInput, newCodeInput);
    });
  }

  LogIn(newNameInput: string, newCodeInput: string) {
    const checkName = this.globals.nameEnterUrls.enterUrls.find(
      (x) => x.name == newNameInput
    );
    if (checkName === undefined) {
      this.message = 'Diesem Namen wurde noch kein Account zugewiesen.';
      return;
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/' + checkName.uri,
      newCodeInput
    );
    result.then((value) => {
      if (value.status === 200) {
        this.globals.account = JSON.parse(value.responseText);
        if (this.globals.account.mainCode === '') {
          let savefile: Savefile = { name: '', code: '' };
          if (this.saveCode) {
            savefile = { name: newNameInput, code: newCodeInput };
          } else {
            savefile = { name: newNameInput, code: '' };
          }
          localStorage.setItem('save', JSON.stringify(savefile));
          this.GoToMenu();
        } else {
          const savefile: Savefile = { name: newNameInput, code: '' };
          localStorage.setItem('save', JSON.stringify(savefile));
          this.CheckMainKey();
        }
      } else {
        if (value.status === 401) {
          this.message = 'Falscher Code! Versuche es noch einmal.';
        } else if (value.status === 429) {
          this.message =
            'Seite ist momentan nicht erreichbar. Bitte versuche es später noch einmal...';
        } else if (value.status === 404) {
          this.message = 'Seite konnte nicht gefunden werden!';
        } else if (value.status === 422) {
          this.message = 'Fehler, keine Zieladresse bekannt.';
        } else {
          this.message = 'Unbekannter Fehler. Versuche es noch einmal.';
        }
      }
    });
  }

  CheckMainKey() {
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      's',
      '',
      this.globals.account.mainCode
    );
    result.then((value) => {
      if (value.status === 200) {
        this.globals.fileURLs = JSON.parse(value.responseText);
      } else if (value.status === 401) {
        alert('Falscher Key!');
        this.globals.account.mainCode = '';
      } else if (value.status === 429) {
        alert('FileURLs nicht erreichbar...');
      } else if (value.status === 404) {
        alert('FileURLs nicht gefunden!');
      } else if (value.status === 422) {
        alert('Fehler, keine Zieladresse bekannt.');
      } else {
        alert('Unbekannter Fehler.');
      }
      this.GoToMenu();
    });
  }

  GoToMenu() {
    this.message = '';
    this.codeInput = '';
    this.router.navigate(['/menu']);
  }
}
