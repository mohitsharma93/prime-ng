import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrongPasswordComponent } from './wrong-password.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: WrongPasswordComponent },
];

@NgModule({
  declarations: [
    WrongPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ]
})
export class WrongPasswordModule { }