import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { UploadComponent } from './upload/upload.component';
import { OptionsComponent } from './options/options.component';
import { OutputComponent } from './output/output.component';

import{MatProgressSpinnerModule, MatRadioModule} from '@angular/material';


import{BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InstructionsComponent,
    UploadComponent,
    OptionsComponent,
    OutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    BrowserAnimationsModule,
    FormsModule
  ], 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 
