import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderComponent } from './order.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { LoaderModule } from '../../loader/loader.module';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
  },
  {
    path: 'detail/:orderId',
    loadChildren: () => import('./order-detail/order-detail.module').then((m) => m.OrderDetailModule)
  },
  {
    path: 'bulk-accept',
    loadChildren: () => import('./bulk-accept-order/bulk-accept-order.module').then((m) => m.BulkAcceptOrderModule)
  },
  {
    path: 'review-shipment',
    loadChildren: () => import('./review-shipment/review-shipment.module').then((m) => m.ReviewShipmentModule)
  }
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
    DropdownModule,
    LoaderModule,
    DynamicDialogModule
  ],
  providers: [DialogService]
})
export class OrderModule { }
