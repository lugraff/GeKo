import { Injectable } from '@angular/core';
import { Account } from '../interfaces/Account';
import { EnterUrls } from '../interfaces/EnterUrls';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  namesUrl: string = '7e3276241191'; //irgendwo speichern wo nicht neu gebuilded erden muss... GitHub?
  account: Account = { name: '', mainCode: '', groupCode: '' };
  fileURLs: string[] = [];
  nameEnterUrls: EnterUrls = { enterUrls: [] };
  forumUrl: string = '';

  onLogOut() {
    localStorage.clear();
    this.account.mainCode = '';
    this.account.name = '';
    this.fileURLs = [];
    this.nameEnterUrls = { enterUrls: [] };
    this.forumUrl = '';
  }
}
