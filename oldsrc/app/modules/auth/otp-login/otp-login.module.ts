
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpLoginComponent } from './otp-login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: OtpLoginComponent },
];

@NgModule({
  declarations: [OtpLoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})

export class OtpLoginModule { }

