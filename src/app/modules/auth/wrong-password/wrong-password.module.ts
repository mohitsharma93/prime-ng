import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrongPasswordComponent } from './wrong-password.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
<<<<<<< .mine// import { SharedModule } from 'src/app/shared/shared.module';
=======>>>>>>> .theirs
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
<<<<<<< .mine    // SharedModule,
=======>>>>>>> .theirs  ]
})
export class WrongPasswordModule { }
