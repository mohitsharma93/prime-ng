import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-admin-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnChanges {

  @Input('minimize') public minimize: boolean;
  public dynamicOpenClass: string = 'side-bar-open'

  constructor(
    private primengConfig: PrimeNGConfig,
    public router: Router,
  ) { }

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
    console.log('router', this.router)
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
