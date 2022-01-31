import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveUserService } from 'src/app/shared/services/active-user.service';

@Component({
  selector: 'app-admin-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  @Output() sideBarToggle: EventEmitter<boolean> = new EventEmitter();
  public toggleValue = true;
  public userDetail: any;

  constructor(
    public router: Router,
    public activeUserService: ActiveUserService
  ) {

  }

  public ngOnInit(): void {
    this.userDetail = this.activeUserService.getUser();
  }

  public toggleSideBar(): void {
    this.toggleValue = !this.toggleValue;
    this.sideBarToggle.emit(this.toggleValue);
  }

  public logout(): void {
    this.activeUserService.removeToken();
  }

}
