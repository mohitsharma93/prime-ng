import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { OrderDetailShipmentComponent } from './order-detail-shipment.component';
import {InputTextModule} from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenuModule } from 'primeng/menu';

const routes: Routes = [
  { 
    path: '', 
    component: OrderDetailShipmentComponent,
  }
];

@NgModule({
  declarations: [
    OrderDetailShipmentComponent
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
    InputTextModule,
    InputNumberModule,
    MenuModule,
  ]
})
export class OrderDetailShipmentModule { }
