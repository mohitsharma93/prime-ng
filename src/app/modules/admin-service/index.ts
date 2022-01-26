import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from './dashboard/dashboard.service';
import { HttpWrapperService } from './httpWrapper';

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
              AdminDashboardService
            ],
        };
    }
}
