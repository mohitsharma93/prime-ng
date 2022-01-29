import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  @Output() sideBarToggle: EventEmitter<boolean> = new EventEmitter();
  public toggleValue = true;

  constructor(
    public router: Router,
  ) { }

  public ngOnInit(): void {

  }

  public toggleSideBar(): void {
    this.toggleValue = !this.toggleValue;
    this.sideBarToggle.emit(this.toggleValue);
  }

  logout(){
   
      localStorage.removeItem("admin_token");
      this.router.navigate(["/"]);
    
  }

}
