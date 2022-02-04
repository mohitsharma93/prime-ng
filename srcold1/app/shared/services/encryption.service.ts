import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare var AES256: any;

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  encrypt() { }

  decrypt(event: any) {
    if (event instanceof HttpResponse && event.status !== 201) {
      if (event.url && event.url.indexOf("/api") > -1) {
        var today = new Date();
        var n = (today.getMonth() + 1).toString();
        var width = 2;
        var z = '0';
        var month = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        var day = today.getDate().toString();
        if (day.length == 1) {
          day = '0' + day;
        }
        var passphras = "201907221201";
        passphras = today.getFullYear() + "" + month + "" + day + "1201";
        var data = JSON.parse(AES256.decrypt(event.body.Data, passphras));
        event.body.Data = data;
        if (event.url.includes('ShopOverview')) {
          event = event.clone({ body: event.body })
        }
        else {
          event = event.clone({ body: event.body.Data })
        }
      }
    }
    return event;
  }
}
