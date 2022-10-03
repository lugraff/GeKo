import { Component, OnInit } from '@angular/core';
import { rooms } from './roomcovered';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent implements OnInit {
  timeline = [1,2,3,4,5,6,7,8,9,10,11,12];
  tempRoom = '';
  tempRoomIndex = 0;
  tempFirstDay = 0;
  rooms2: rooms[] = [
    { name: 'Z1', days: [5, 6, 7, 8] },
    { name: 'Z2', days: [] },
    { name: 'Z3', days: [8, 9, 10, 11] },
    { name: 'Z4', days: [] },
    { name: 'Z5', days: [1, 2, 11, 12] },
  ];
  constructor() {}

  ngOnInit(): void {}

  onDown(firstDay: number, room: string, i: number) {
    console.log(room + ' ' + firstDay);

    this.tempRoom = room;
    this.tempFirstDay = firstDay;
    this.tempRoomIndex = i;
  }
  onUp(lastDay: number) {
    console.log(lastDay);
    if (this.tempFirstDay <= 0) {
      return;
    }
    let newCoveredDays: number[] = [];
    let newDay = this.tempFirstDay;
    while (newDay <= lastDay) {
      newCoveredDays.push(newDay);
      newDay += 1;
    }
    this.rooms2.splice(this.tempRoomIndex,1,{ name: this.tempRoom, days: newCoveredDays });

    this.tempRoom = '';
    this.tempFirstDay = 0;
    this.tempRoomIndex = 0;
  }
}
