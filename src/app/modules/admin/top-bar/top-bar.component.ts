import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { ActiveUserService } from 'src/app/shared/services/active-user.service';
import { topBarSearchString } from 'src/app/store/actions/root.actions';
import { IAppState } from 'src/app/store/app.state';

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

  constructor(
    public router: Router,
    public activeUserService: ActiveUserService,
    private store: Store<IAppState>,
    private subjectService: SubjectService
  ) {

  }

  public ngOnInit(): void {
    this.userDetail = this.activeUserService.getUser();
    this.searchControl.valueChanges.pipe(debounceTime(400)).subscribe(res => {
      // this.store.dispatch(topBarSearchString({ response: res}))
      this.subjectService.setSearchStringFromTobBar(res);
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
