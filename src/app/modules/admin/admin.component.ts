import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public minimize = true;

  constructor() { }

  ngOnInit(): void {
  }

  public getSideBarToggle(e: boolean) {
    // if (e) {
    //   this.sideBarPixel = '220px'
    // } else {
    //   this.sideBarPixel = '70px'
    // }
    // console.log('e', e)
    // console.log('sideBarPixel', this.sideBarPixel)
    this.minimize = e;
  }

}
