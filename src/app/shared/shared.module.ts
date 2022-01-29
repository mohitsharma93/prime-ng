import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from './services/data.service';
import { UserAuthService } from './services/user-auth.service';
import { ToasterService } from './services/toaster.service';
import { EncryptionService } from './services/encryption.service';
import { UtilsService } from './services/utils.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    DataService,
    UserAuthService,
    ToasterService,
    EncryptionService,
    UtilsService
  ],
})
export class SharedModule { }
