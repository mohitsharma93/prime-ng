import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpWrapperService } from './httpWrapper';
import { AdminDashboardService } from './dashboard/dashboard.service';
import { AdminOrderService } from './order/order.service';
import { SubjectService } from './subject.service';

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
                SubjectService,
            ],
        };
    }
}
