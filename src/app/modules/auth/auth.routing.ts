import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                loadChildren: () => import('./login/login.module').then((m) => m.LoginModule)
            },
            {
                path: 'change-password',
                loadChildren: () => import('./change-password/change-password.module').then((m) => m.ChangePasswordModule)
            },
            {
                path: 'otp-login',
                loadChildren: () => import('./otp-login/otp-login.module').then((m) => m.OtpLoginModule)
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
    static declarations = [AuthComponent];

}