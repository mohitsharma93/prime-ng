import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from './services/data.service';
import { UserAuthService } from './services/user-auth.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    DataService,
    UserAuthService
  ],
})
export class SharedModule { }
