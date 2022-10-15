import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceToLine',
})
export class SpaceToLinePipe implements PipeTransform {
  transform(char: string): string {
    if (char === ' ') {
      return '_';
    }
    return char;
  }
}
