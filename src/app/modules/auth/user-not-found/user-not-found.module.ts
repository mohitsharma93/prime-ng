import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNotFoundComponent } from './user-not-found.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  { path: '', component: UserNotFoundComponent },
];

@NgModule({
  declarations: [
    UserNotFoundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule]
})
export class UserNotFoundModule { }
