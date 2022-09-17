import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { MenuComponent } from './components/menu/menu.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: '',
   component: WelcomeComponent
  },
  { path: 'menu',
   component: MenuComponent,
   children: [
    {
      path: 'file-manager',
      component: FileManagerComponent
    }]
  },
  /*{
    path: '**',
    redirectTo: '',
  },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
