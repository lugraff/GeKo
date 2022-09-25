import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from 'src/app/route-transition-animations';
import { GlobalsService } from 'src/app/services/globals.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  animations: [routeTransitionAnimations],
})
export class MenuComponent {
  constructor(public globals: GlobalsService) {}

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
