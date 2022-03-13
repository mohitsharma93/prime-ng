import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';

@Component({
  selector: 'app-confirmation-model',
  templateUrl: './confirmation-model.component.html',
  styleUrls: ['./confirmation-model.component.scss']
})
export class ConfirmationModelComponent implements OnInit {
  data: { action: string, message: string } = { action: '', message: '' };
  confirmationModel: any = {
    status: false, action: '', message: ''
  }
  message: string;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService) {
    this.data = config.data;
  }

  ngOnInit() {

  }
  onConfirmClick() {
    this.confirmationModel.status = true;
    this.confirmationModel.action = this.data.action;
    this.confirmationModel.message = 'Confirmed';
    this.confirmationService.confirmation(this.confirmationModel);
    setTimeout(() => {
      this.ref.close();
    }, 300);
  }
  onCancelClick() {
    this.ref.close();
  }



}
