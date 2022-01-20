import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'order',
                loadChildren: () => import('./order/order.module').then((m) => m.OrderModule)
            },
            {
                path: 'order-detail/:orderId',
                loadChildren: () => import('./order-detail/order-detail.module').then((m) => m.OrderDetailModule)
            },
        ]
    }
];
@NgModule({
    imports: [RouterModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
    static declarations = [AdminComponent];

}