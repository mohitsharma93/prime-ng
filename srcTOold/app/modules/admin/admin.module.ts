import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin.routing';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import {SidebarModule} from 'primeng/sidebar';
import { AdminServiceModule } from 'src/app/shared/admin-service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AdminComponent,
    SideBarComponent,
    TopBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SidebarModule,
    AdminServiceModule.forRoot(),
  ],
  providers: [
    { provide: 'ADMIN_API_URL', useValue: environment.API_ENDPOINT + '' + environment.API_ENDPOINT_PROXY }
  ]
})
export class AdminModule { }
