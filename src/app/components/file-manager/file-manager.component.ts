import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../../services/globals.service';
import { Account } from '../../interfaces/Account';
import { NewFileResponse } from '../../interfaces/NewFileResponse';
import { JsonAPIService } from 'src/app/services/jsonAPI.service';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
})
export class FileManagerComponent implements OnInit {
  codeInput = '';
  securityInput = '';
  privateInput = false;
  nameInput = '';
  userGetMainKey = false;
  selectedFileNumber = -1;
  textArea = '';

  constructor(
    public globals: GlobalsService,
    private jsonApi: JsonAPIService
  ) {}

  ngOnInit(): void {}

  onSendCode() {
    if (this.codeInput.length !== 36) {
      alert('Falscher Code!');
      return;
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      's',
      '',
      this.codeInput
    );
    result.then((value) => {
      if (value.status === 200) {
        this.globals.account.mainCode = JSON.parse(
          JSON.stringify(this.codeInput)
        );
        this.globals.fileURLs = JSON.parse(value.responseText);
        this.codeInput = '';
      } else {
        alert(value.status);
      }
    });
  }

  onSelectFile(index: number): void {
    this.selectedFileNumber = index;
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/' + this.globals.fileURLs[index],
      this.securityInput
    );
    result.then((value) => {
      this.textArea = value.responseText;
    });
  }

  newAccount(): void {
    const securityCode = this.securityInput;
    let mainkey = '';
    if (this.userGetMainKey) {
      mainkey = this.globals.account.mainCode;
    }
    const newAccount: Account = {
      name: this.nameInput,
      mainCode: mainkey,
      groupCode: this.globals.account.groupCode,
    };
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'POST',
      '',
      securityCode,
      this.globals.account.mainCode,
      '',
      '',
      '',
      '',
      this.getPrivateAsString(),
      JSON.stringify(newAccount)
    );
    result.then((value) => {
      if (value.status === 201) {
        const responseObj: NewFileResponse = JSON.parse(value.responseText);
        this.globals.fileURLs.push(responseObj.id);
        this.selectedFileNumber = this.globals.fileURLs.length - 1;
        navigator.clipboard.writeText(
          newAccount.name +
            ' SecCode: ' +
            securityCode +
            ' URI: ' +
            responseObj.id
        );
        setTimeout(() => this.ActivateAccount(newAccount, responseObj), 333);
      } else {
        alert(value.status);
      }
    });
  }

  ActivateAccount(newAccount: Account, responseObj: NewFileResponse): void {
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PATCH',
      '/' + this.globals.namesUrl,
      '',
      '',
      'json-patch+json',
      'add',
      '/enterUrls/-',
      '{"name":"' + newAccount.name + '", "uri":"' + responseObj.id + '"}'
    );
    result.then((value) => {
      if (value.status === 200) {
        this.textArea = JSON.stringify(newAccount);
        alert('Account für ' + newAccount.name + ' erstellt.');
      } else {
        alert(value.status);
      }
    });
  }

  deleteAccount() {
    const nameInput = this.nameInput;
    let fileIndex = -1;
    for (
      let index = 0;
      index < this.globals.nameEnterUrls.enterUrls.length;
      index++
    ) {
      if (this.globals.nameEnterUrls.enterUrls[index].name === nameInput) {
        fileIndex = index;
        break;
      }
    }
    if (fileIndex === -1) {
      alert('Name nicht gefunden.');
      return;
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PATCH',
      '/' + this.globals.namesUrl,
      '',
      '',
      'json-patch+json',
      'remove',
      '/enterUrls/',
      fileIndex.toString()
    );
    result.then((value) => {
      if (value.status === 200) {
        setTimeout(() => this.deleteUser(), 333);
      } else {
        alert(value.status);
      }
    });
  }
  deleteUser() {
    const filenumber = this.selectedFileNumber;
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'DELETE',
      '/' + this.globals.fileURLs[filenumber],
      this.securityInput
    );
    result.then((value) => {
      if (value.status === 200) {
        this.globals.fileURLs.splice(filenumber, 1);
        this.selectedFileNumber = -1;
        this.textArea = '';
        this.nameInput = '';
        alert('Account gelöscht.');
      } else {
        alert(value.status);
      }
    });
  }

  onNew(): void {
    if (this.textArea === '') {
      return;
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'POST',
      '',
      this.securityInput,
      this.globals.account.mainCode,
      '',
      '',
      '',
      '',
      this.getPrivateAsString(),
      this.textArea
    );
    result.then((value) => {
      if (value.status === 201) {
        const responseObj: NewFileResponse = JSON.parse(value.responseText);
        this.globals.fileURLs.push(responseObj.id);
        this.selectedFileNumber = this.globals.fileURLs.length - 1;
      } else {
        alert(value.status);
      }
    });
  }

  onDeleteFile() {
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'DELETE',
      '/' + this.globals.fileURLs[this.selectedFileNumber],
      this.securityInput
    );
    result.then((value) => {
      if (value.status === 200) {
        this.globals.fileURLs.splice(this.selectedFileNumber, 1);
        this.selectedFileNumber = -1;
        this.textArea = '';
      } else {
        alert(value.status);
      }
    });
  }

  onUpdateFile() {
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PUT',
      '/' + this.globals.fileURLs[this.selectedFileNumber],
      this.securityInput,
      '',
      '',
      '',
      '',
      '',
      '',
      this.textArea
    );
    result.then((value) => {
      if (value.status === 200) {
        alert('Datei aktualisiert.');
      } else if (value.status === 401) {
        alert('Falscher Security Code!');
      } else if (value.status === 429) {
        alert('Abruflimit überschritten!');
      } else if (value.status === 413) {
        alert('Datei zu groß!');
      } else {
        alert(value.status);
      }
    });
  }

  getPrivateAsString(): string {
    if (this.privateInput) {
      return 'true';
    }
    return 'false';
  }
}
