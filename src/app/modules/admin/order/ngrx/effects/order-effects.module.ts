import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { OrderEffects } from './order.effects';

@NgModule({
    imports: [EffectsModule.forFeature([OrderEffects])],
    exports: [EffectsModule],
})
export class OrderEffectsModule {
    public static forFeature(): ModuleWithProviders<OrderEffectsModule> {
        return {
            ngModule: OrderEffectsModule,
            providers: [],
        };
    }
}
