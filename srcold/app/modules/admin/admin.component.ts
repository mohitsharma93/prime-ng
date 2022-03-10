import { Component, HostListener, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/admin-service/localstorage.service';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends BaseComponent implements OnInit {
  public minimize = true;
  public addPadding = false;
  public addPaddingUrl = ['/admin/order/bulk-accept', '/admin/order/detail'];

  constructor(
    private router: Router,
    private subjectService: SubjectService,
    private localStorageService: LocalStorageService
  ) {
    super();
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if ( event.id === 1 && event.url === event.urlAfterRedirects  ) {
          this.getValueAfterReload(event);
        } else {
          this.removeStorageValueByUrl(event);
        }
        if (event && !event.url.includes('/admin/order')) {
          this.subjectService.setSaveFilterOnRedirection(null);
        } else {
          if (event && event.url === '/admin/order') {
            this.localStorageService.remove('holdIdsForCreateShipment');
          }
        }
        const paddingAdd =
          event.url.includes('/admin/order/bulk-accept') ||
          event.url.includes('/admin/order/detail') ||
          event.url.includes('/admin/order/review-shipment');

        if (event && paddingAdd) {
          this.addPadding = true;
        } else {
          this.addPadding = false;
        }
    });
  }

  ngOnInit(): void {
    // this.router.events
    //   .pipe(
    //     filter((event) => event instanceof NavigationStart),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe((event: Event) => {
    //     if (event instanceof NavigationStart) {
    //       if (event && !event.url.includes('/admin/order')) {
    //         this.subjectService.setSaveFilterOnRedirection(null);
    //       }
    //       const paddingAdd =
    //         event.url.includes('/admin/order/bulk-accept') ||
    //         event.url.includes('/admin/order/detail') ||
    //         event.url.includes('/admin/order/review-shipment');

    //       if (event && paddingAdd) {
    //         this.addPadding = true;
    //       } else {
    //         this.addPadding = false;
    //       }
    //     }
    //   });
  }

  public getSideBarToggle(e: boolean) {
    // if (e) {
    //   this.sideBarPixel = '220px'
    // } else {
    //   this.sideBarPixel = '70px'
    // }
    this.minimize = e;
  }

  public objectLength(obj: any) {
    return obj && Object.keys(obj).length;
  }

  @HostListener('window:beforeunload', ['$event']) 
  beforeUnloadHandler(event: any) {
    this.setValueBeforeReload();
  }

  public setValueBeforeReload() {
    // console.log('this.subjectService', this.subjectService);
    // this.localStorageService.clearStorage();
    const filter = this.subjectService.saveFilterOnRedirection.value;
    if (filter && this.objectLength(filter))  {
      this.localStorageService.set('filter', filter);
    }
    const orderDetail = this.subjectService.orderDetail.value;
    if (orderDetail && this.objectLength(orderDetail)) {
      this.localStorageService.set('orderDetail', orderDetail);
    }

    const orderDetailShipment = this.subjectService.orderDetailShipment.value;
    if (orderDetailShipment && this.objectLength(orderDetailShipment)) {
      this.localStorageService.set('orderDetailShipment', orderDetailShipment);
      this.localStorageService.set('orderDetail', orderDetail);
    }

    const holdBulkDataForNext = this.subjectService.holdBulkDataForNext.value;
    if (holdBulkDataForNext && this.objectLength(holdBulkDataForNext)) {
      this.localStorageService.set('holdBulkDataForNext', holdBulkDataForNext);
    }

    const oldOrderCountSumForConfirmScreen = this.subjectService.oldOrderCountSumForConfirmScreen.value;
    if (oldOrderCountSumForConfirmScreen && this.objectLength(oldOrderCountSumForConfirmScreen)) {
      this.localStorageService.set('oldOrderCountSumForConfirmScreen', oldOrderCountSumForConfirmScreen);
    }

    const holdBulkOrderIdsForCancel = this.subjectService.holdBulkOrderIdsForCancel.value;
    if (oldOrderCountSumForConfirmScreen && holdBulkOrderIdsForCancel?.length) {
      this.localStorageService.set('holdBulkOrderIdsForCancel', holdBulkOrderIdsForCancel);
    }
    
    const holdIdsForCreateShipment = this.subjectService.holdIdsForCreateShipment.value;
    console.log('holdIdsForCreateShipment', holdIdsForCreateShipment);
    if (holdIdsForCreateShipment && holdIdsForCreateShipment?.length) {
      this.localStorageService.set('holdIdsForCreateShipment', holdIdsForCreateShipment)
    }
  }

  public getValueAfterReload(event: any) {
    const shipmentDetailPatterUrlTest = /^\/admin\/order\/detail\/\d+\/s\/\d+$/g;
    const orderDetailUrlPatter = /^\/admin\/order\/detail\/\d+$/g;
    if (event.url === "/admin/order") {
      const filter = this.localStorageService.get('filter');
      this.subjectService.setSaveFilterOnRedirection(filter);
      this.localStorageService.remove('filter');
      // this.localStorageService.clearStorage();
    }
    if (orderDetailUrlPatter.test(event.url)) {
      const orderDetail = this.localStorageService.get('orderDetail');
      this.subjectService.setOrderDetail(orderDetail);
      this.localStorageService.remove('orderDetail');

      // 
      const holdIdsForCreateShipment = this.localStorageService.get('holdIdsForCreateShipment') || null;
      this.subjectService.setHoldIdsForCreateShipment(holdIdsForCreateShipment);
      this.localStorageService.remove('holdIdsForCreateShipment');
    }
    if (shipmentDetailPatterUrlTest.test(event.url)){
      const orderDetailShipment = this.localStorageService.get('orderDetailShipment');
      this.subjectService.setOrderDetailShipment(orderDetailShipment);
      this.localStorageService.remove('orderDetailShipment');
      const orderDetail = this.localStorageService.get('orderDetail');
      this.subjectService.setOrderDetail(orderDetail);
    }
    if (event.url === '/admin/order/bulk-accept') {
      this.localStorageService.remove('holdBulkDataForNext');
      this.localStorageService.remove('oldOrderCountSumForConfirmScreen');
      this.localStorageService.remove('holdBulkOrderIdsForCancel');
    }
    if (event.url === '/admin/order/bulk-accept/confirm' || event.url === '/admin/order/bulk-accept/cancel') {
      const bulkDataForNext = this.localStorageService.get('holdBulkDataForNext');
      this.subjectService.setHoldBulkDataForNext(bulkDataForNext);
      if (event.url === '/admin/order/bulk-accept/confirm') {
        this.localStorageService.remove('holdBulkDataForNext');
      }

      const oldOrderCountSumForConfirmScreen = this.localStorageService.get('oldOrderCountSumForConfirmScreen');
      this.subjectService.setHoldOrderCountSumForConfirmScreen(oldOrderCountSumForConfirmScreen);
      if (event.url === '/admin/order/bulk-accept/confirm') {
        this.localStorageService.remove('oldOrderCountSumForConfirmScreen');
      }
    }

    if (event.url === '/admin/order/bulk-accept/cancel') {
      const holdBulkOrderIdsForCancel = this.localStorageService.get('holdBulkOrderIdsForCancel');
      this.subjectService.setHoldBulkOrderIdsForCancel(holdBulkOrderIdsForCancel);
      this.localStorageService.remove('holdBulkOrderIdsForCancel');
    }

    if (event.url === '/admin/order/review-shipment'){
      const holdIdsForCreateShipment = this.localStorageService.get('holdIdsForCreateShipment');
      this.subjectService.setHoldIdsForCreateShipment(holdIdsForCreateShipment);
      this.localStorageService.remove('holdIdsForCreateShipment');
    }

    // this.localStorageService.clearStorage();
  }

  public removeStorageValueByUrl(event: any) {
    // if (event.id !== 1 && event.url === "/admin/order") {
    //   this.localStorageService.remove('filter');
    // }
    // if ()
    // console.log('event.url', event.url)
  }
}
