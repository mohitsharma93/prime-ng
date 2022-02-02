import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import {ChartModule} from 'primeng/chart';
import { DashboardEffectsModule } from './ngrx/effects/dashboard-effects.module';
import { dashboardsReducer } from './ngrx/store/dashboard.state';
import { StoreModule } from '@ngrx/store';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    ChartModule,
    StoreModule.forFeature('dashboard', dashboardsReducer),
    DashboardEffectsModule,
  ]
})
export class DashboardModule { }
