import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './dashboard.effects';

@NgModule({
    imports: [EffectsModule.forFeature([DashboardEffects])],
    exports: [EffectsModule],
})
export class DashboardEffectsModule {
    public static forFeature(): ModuleWithProviders<DashboardEffectsModule> {
        return {
            ngModule: DashboardEffectsModule,
            providers: [],
        };
    }
}
