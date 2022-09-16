import { Injectable } from '@angular/core';
import { Account } from './interfaces/Account';


@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  nameEnterURLs: Array<{name:string; uri:string}> = [ {"name":"Jana","uri":"0c2051164719"},
                                                      {"name":"Lucas","uri":"5e3cae5b2a29"} ];
  account: Account = {name:"",uri:"",mainCode:""};
  fileURLs:string[] = [];
  secCode:string = "";
}
