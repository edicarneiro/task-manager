import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // NOVO: Módulo para *ngIf e *ngFor

import { AppComponent } from './app.component';
import { TaskService } from './task.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule // NOVO: Adicionado aqui
  ],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
