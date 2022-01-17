import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { OtpComponent } from './pages/otp/otp.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path:"",
    component:UserComponent,
    children:[
      {
        path:"",
        component:IndexComponent
      },
      {
        path:"otp",
        component:OtpComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
