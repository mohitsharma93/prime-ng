import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderComponent } from './order.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import {DropdownModule} from 'primeng/dropdown';

const routes: Routes = [
  { 
    path: '', 
    component: OrderComponent,
  },
  { 
    path: 'detail/:orderId', 
    loadChildren: () => import('./order-detail/order-detail.module').then((m) => m.OrderDetailModule)
  },
];

@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    TableModule,
    PaginatorModule,
    DropdownModule
  ]
})
export class OrderModule { }
