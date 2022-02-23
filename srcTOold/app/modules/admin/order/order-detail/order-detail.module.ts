import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { OrderDetailComponent } from './order-detail.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailComponent,
  },
  {
    path: 's/:id',
    loadChildren: () => import('../order-detail-shipment/order-detail-shipment.module').then((m) => m.OrderDetailShipmentModule)
  },

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
    InputTextModule,
    InputNumberModule,
    MenuModule,
    DynamicDialogModule
  ],
  providers: [DialogService]
})
export class OrderDetailModule { }
