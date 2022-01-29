import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from './dashboard/dashboard.service';
import { HttpWrapperService } from './httpWrapper';
import { AdminOrderService } from './dashboard/order.service';

@NgModule({
    imports: [CommonModule],
    providers: [],
})
export class AdminServiceModule {
    public static forRoot(): ModuleWithProviders<AdminServiceModule> {
        return {
            ngModule: AdminServiceModule,
            providers: [
                HttpWrapperService,
                AdminDashboardService,
                AdminOrderService,
            ],
        };
    }
}
