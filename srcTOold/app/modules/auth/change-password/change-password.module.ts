
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  {
    path: "",
    children: [
      { path: ":id", component: ChangePasswordComponent },

    ],
  },
];

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
  ]
})

export class ChangePasswordModule { }

