import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { filter, takeUntil } from 'rxjs';
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
    private primengConfig: PrimeNGConfig,
    public router: Router,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      takeUntil(this.destroy$)
    ).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (event && (event.url.includes('/admin/order/bulk-accept') || event.url.includes('/admin/order/detail'))) {
          this.visible = false;
        } else {
          this.visible = true;
        }
      }
    })
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
