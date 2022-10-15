import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textWrapper',
})
export class TextWrapperPipe implements PipeTransform {
  transform(text: string, lenght: number, start: boolean = false): string {
    if (start) {
      return text.substring(text.length - lenght, text.length + lenght);
    } else {
      return text.substring(0, lenght);
    }
  }
}
