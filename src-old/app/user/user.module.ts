import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule,FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { IndexComponent } from './pages/index/index.component';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { OtpComponent } from './pages/otp/otp.component';
@NgModule({
  declarations: [
    UserComponent,
    IndexComponent,
    OtpComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    DividerModule
  ]
})
export class UserModule { }
