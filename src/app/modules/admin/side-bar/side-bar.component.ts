import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-admin-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  public dynamicSideBarWidth = '220px';
  constructor(
    private primengConfig: PrimeNGConfig,
    public router: Router
  ) { }

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
    console.log('router', this.router)
  }

}
