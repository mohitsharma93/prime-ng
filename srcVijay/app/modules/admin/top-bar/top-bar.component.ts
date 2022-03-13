import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { ActiveUserService } from 'src/app/shared/services/active-user.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-admin-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  @Output() sideBarToggle: EventEmitter<boolean> = new EventEmitter();
  public toggleValue = true;
  public userDetail: any;
  public searchControl: FormControl = new FormControl('');
  userData: { displayName: string } = {
    displayName: '',
  };

  constructor(
    public router: Router,
    public activeUserService: ActiveUserService,
    private subjectService: SubjectService,
    private dataService: DataService,
  ) {

  }

  public ngOnInit(): void {
    this.userDetail = this.activeUserService.getUser();
    this.getUserData(this.userDetail.UserId);
    this.searchControl.valueChanges.pipe(debounceTime(400)).subscribe((res: any) => {
      console.log(res)
      this.subjectService.setSearchStringFromTobBar(res);
    })
  }

  getUserData(id: any) {
    const req = {
      url: 'api/sellerDashboard/ShopOverview/GetSellerNameInfo',
      params: { id }
    };
    this.dataService.get(req).subscribe((res: any) => {
      if (res.Status === 'OK') {
        if (res.Data && res.Data.UserName) {
          this.userData.displayName = res.Data.UserName;
        }
      }
    })
  }

  public toggleSideBar(): void {
    this.toggleValue = !this.toggleValue;
    this.sideBarToggle.emit(this.toggleValue);
  }

  public logout(): void {
    this.activeUserService.removeToken();
  }

  public resetSearch(): void {
    this.searchControl.setValue('')
  }
}