import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationBulkAcceptComponent } from './confirmation-bulk-accept.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';

const routes: Routes = [
  {
    path: '',
    component: ConfirmationBulkAcceptComponent,
  },
];

@NgModule({
  declarations: [
    ConfirmationBulkAcceptComponent
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
  ],
  providers: [
    DialogService
  ],
})
export class ConfirmationBulkAcceptModule { }
