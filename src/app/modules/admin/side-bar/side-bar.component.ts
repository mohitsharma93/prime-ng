import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationStart, Router, Event, NavigationEnd } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { filter, take, takeUntil } from 'rxjs';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-admin-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('minimize') public minimize: boolean;
  public dynamicOpenClass: string = 'side-bar-open';
  public visible: boolean = true;

  constructor(
    public router: Router,
    public subjectService: SubjectService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      takeUntil(this.destroy$)
    ).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('event.url', event.url)
        const changeVisible = 
          event.url.includes('/admin/order/bulk-accept') ||
          event.url.includes('/admin/order/detail') ||
          event.url.includes('/admin/order/review-shipment');
          console.log('event.url', changeVisible)
        if (event && changeVisible) {
          this.visible = false;
        } else {
          this.visible = true;
        }
      }
    })
    this.subjectService.screenExpand$.pipe(take(1)).subscribe((res: any) => {
      console.log('res', res)
      // this.visible = !res;
    });
  }

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    if ('minimize' in simpleChanges) {
      if (simpleChanges['minimize'].currentValue) {
        this.dynamicOpenClass = 'side-bar-open'
      } else {
        this.dynamicOpenClass = 'side-bar-half-open'
      }
    }
  }

}
