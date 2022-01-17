import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
            },
            {
                path: 'user-not-found',
                loadChildren: () => import('./user-not-found/user-not-found.module').then((m) => m.UserNotFoundModule)
            },
            {
                path: 'wrong-password',
                loadChildren: () => import('./wrong-password/wrong-password.module').then((m) => m.WrongPasswordModule)
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