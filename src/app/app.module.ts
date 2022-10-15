import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { ForumComponent } from './components/forum/forum.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { TexteditorComponent } from './components/texteditor/texteditor.component';
import { TypeWriterComponent } from './components/type-writer/type-writer.component';
import { TextWrapperPipe } from './services/text-wrapper.pipe';
import { SpaceToLinePipe } from './services/space-to-line.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    MenuComponent,
    FileManagerComponent,
    ForumComponent,
    ChartComponent,
    ScheduleComponent,
    TexteditorComponent,
    TypeWriterComponent,
    TextWrapperPipe,
    SpaceToLinePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule,
  ],
  providers: [HttpClient, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
