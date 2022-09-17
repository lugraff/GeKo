import { Injectable } from '@angular/core';
import { Account } from './interfaces/Account';
import { EnterUrl } from './interfaces/EnterUrl';
import { EnterUrls } from './interfaces/EnterUrls';


@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  namesUrl:string = "7e3276241191";//irgendwo speichern wo nicht neu gebuilded erden muss... GitHub?
  account: Account = {name:"",mainCode:""};
  fileURLs:string[] = [];
  nameEnterUrls:EnterUrls = {enterUrls:[]};
  //{"enterUrls":[{"name":"Jana","uri":"0c2051164719"},{"name":"Lucas","uri":"5e3cae5b2a29"},{"name":"Steve","uri":"726579cbbd8b"}]}
}
