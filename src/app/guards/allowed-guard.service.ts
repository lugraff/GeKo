import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { GlobalsService } from '../services/globals.service';

@Injectable({
  providedIn: 'root',
})
export class AllowedGuardService implements CanActivate {
  constructor(private globals: GlobalsService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    /*while (this.globals.nameEnterUrls.enterUrls.length === 0) {
      await new Promise(f => setTimeout(f, 100));
    }*/
    if (this.globals.account.name !== '') {
      return true;
    } else {
      alert('Route gesperrt!');
      this.router.navigate(['/']);
      return false;
    }
  }
}
