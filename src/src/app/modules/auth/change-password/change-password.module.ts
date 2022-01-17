import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: ChangePasswordComponent },
];

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class ChangePasswordModule { }
