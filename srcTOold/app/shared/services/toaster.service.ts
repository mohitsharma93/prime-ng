import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private messageService: MessageService) { }

  ngOnInit() { }

  success(message: string) {
    this.messageService.add({ severity: 'success', summary: message });
  }

  error(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error:', detail: message });
  }

  info(message: string) {
    this.messageService.add({ severity: 'info', summary: message });
  }

  warning(message: string) {
    this.messageService.add({ severity: 'warning', summary: message });
  }

}


