import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { OrderDetailComponent } from './order-detail.component';
import {InputTextModule} from 'primeng/inputtext';

const routes: Routes = [
  { 
    path: '', 
    component: OrderDetailComponent,
  }
];

@NgModule({
  declarations: [
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    DialogModule,
    InputTextModule
  ]
})
export class OrderDetailModule { }
