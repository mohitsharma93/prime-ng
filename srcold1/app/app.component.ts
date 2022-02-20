import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveUserService } from './shared/services/active-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  toasterConfig: any = { position: 'bottom-right' };
  title = 'b2bDirectSellerDesktop';

  constructor(  
    private activeUserService: ActiveUserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.activeUserService.getToken()) {
      // this.router.navigate(["auth/login"])
    }
  }
}

