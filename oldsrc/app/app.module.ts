import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './shared/interceptor/auth-interceptor.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthGuardService } from './shared/guards/auth-guard.service';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { extModules } from './store';
import {  metaReducers, reducers } from './store/app.state';
import { EffectModule } from './store/effects/effects.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';



const envModule = environment.production ? [] : extModules;

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectModule,
    ...envModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true, },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }