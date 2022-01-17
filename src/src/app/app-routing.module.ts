import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: "", redirectTo: "auth/login", pathMatch: "full" },
  //...............Route Added
  {
    path: "auth",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./modules/admin/admin.module").then((m) => m.AdminModule),
  },
 ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
