import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { BulkAcceptOrderComponent } from './bulk-accept-order.component';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

const routes: Routes = [
  { 
    path: '', 
    component: BulkAcceptOrderComponent,
  },
  {
    path: 'cancel',
    loadChildren: () => import('./bulk-accept-cancel-order/bulk-accept-cancel-order.module').then((m) => m.BulkAcceptCancelOrderModule)
  },
  {
    path: 'confirm',
    loadChildren: () => import('./confirmation-bulk-accept/confirmation-bulk-accept.module').then((m) => m.ConfirmationBulkAcceptModule)
  }
];

@NgModule({
  declarations: [
    BulkAcceptOrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    DropdownModule,
    DialogModule,
    InputNumberModule
  ]
})
export class BulkAcceptOrderModule { }
