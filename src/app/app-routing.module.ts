import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './components/chart/chart.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { ForumComponent } from './components/forum/forum.component';
import { MenuComponent } from './components/menu/menu.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { TexteditorComponent } from './components/texteditor/texteditor.component';
import { TypeWriterComponent } from './components/type-writer/type-writer.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AllowedGuardService } from './guards/allowed-guard.service';
import { LeaveGuardService } from './guards/leave-guard.service';

const routes: Routes = [
  { path: '', component: WelcomeComponent, data: { animation: 'Z' } },
  {
    path: 'menu',
    component: MenuComponent,
    data: { animation: 'default' },
    children: [
      {
        path: 'file-manager',
        component: FileManagerComponent,
        data: { animation: 'default' },
      },
      {
        path: 'forum',
        canActivate: [AllowedGuardService],
        component: ForumComponent,
        data: { animation: 'default' },
      },
      {
        path: 'chart',
        canActivate: [AllowedGuardService],
        component: ChartComponent,
        data: { animation: 'default' },
      },
      {
        path: 'schedule',
        canActivate: [AllowedGuardService],
        component: ScheduleComponent,
        data: { animation: 'default' },
      },
      {
        path: 'text-editor',
        canActivate: [AllowedGuardService],
        component: TexteditorComponent,
        data: { animation: 'default' },
      },
      {
        path: 'type-writer',
        //canActivate: [AllowedGuardService],
        component: TypeWriterComponent,
        data: { animation: 'default' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    data: { animation: 'Z' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LeaveGuardService, AllowedGuardService],
})
export class AppRoutingModule {}
