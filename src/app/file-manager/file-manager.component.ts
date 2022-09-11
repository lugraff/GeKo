import { Component, OnInit, NgModule } from '@angular/core';
import { GlobalsService } from "../globals.service";

import jsonFile from '../test.json';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html'
})
export class FileManagerComponent implements OnInit {
  files = ["A","Test"];

  constructor(private globals:GlobalsService) {
    this.files = globals.fileURLs;
   }

  ngOnInit(): void {
    console.log(this.files);
    for (const file of this.files) {
      console.log(file);
    }
  }

}
