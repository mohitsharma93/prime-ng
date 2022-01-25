import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';

export const extModules = [
    StoreDevtoolsModule.instrument({
        maxAge: 150,
    }),
];
