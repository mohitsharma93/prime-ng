import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '../user/pages/index/index.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path:"",
    component:UserComponent,
    children:[
      {
        path:"",
        component:IndexComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
