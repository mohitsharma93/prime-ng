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
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
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
