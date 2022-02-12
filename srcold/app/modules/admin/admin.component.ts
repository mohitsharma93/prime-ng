import { Component, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends BaseComponent implements OnInit {
  public minimize = true;
  public addPadding = false;
  public addPaddingUrl = ['/admin/order/bulk-accept', '/admin/order/detail'];

  constructor(private router: Router, private subjectService: SubjectService) {
    super();
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          if (event && !event.url.includes('/admin/order')) {
            this.subjectService.setSaveFilterOnRedirection(null);
          }
          const paddingAdd =
            event.url.includes('/admin/order/bulk-accept') ||
            event.url.includes('/admin/order/detail') ||
            event.url.includes('/admin/order/review-shipment');

          if (event && paddingAdd) {
            this.addPadding = true;
          } else {
            this.addPadding = false;
          }
        }
      });
  }

  public getSideBarToggle(e: boolean) {
    // if (e) {
    //   this.sideBarPixel = '220px'
    // } else {
    //   this.sideBarPixel = '70px'
    // }
    this.minimize = e;
  }
}
