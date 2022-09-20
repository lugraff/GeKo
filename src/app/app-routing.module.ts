import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { ForumComponent } from './components/forum/forum.component';
import { MenuComponent } from './components/menu/menu.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AllowedGuardService } from './guards/allowed-guard.service';
import { LeaveGuardService } from './guards/leave-guard.service';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      {
        path: 'file-manager',
        component: FileManagerComponent,
      },
      {
        path: 'forum',
        canActivate: [AllowedGuardService],
        component: ForumComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LeaveGuardService, AllowedGuardService],
})
export class AppRoutingModule {}
