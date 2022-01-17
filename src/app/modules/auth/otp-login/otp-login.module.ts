import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpLoginComponent } from './otp-login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
// import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: OtpLoginComponent },
];

@NgModule({
  declarations: [OtpLoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    InputTextModule,
  ]
})
export class OtpLoginModule { }
