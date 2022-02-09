import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { BulkAcceptCancelOrderComponent } from './bulk-accept-cancel-order.component';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
  { 
    path: '', 
    component: BulkAcceptCancelOrderComponent,
  },
];

@NgModule({
  declarations: [
    BulkAcceptCancelOrderComponent
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
    DialogModule
  ]
})
export class BulkAcceptCancelOrderModule { }
