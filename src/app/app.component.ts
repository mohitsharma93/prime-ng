import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  toasterConfig: any = { position: 'bottom-right' };

  title = 'b2bDirectSellerDesktop';
}
