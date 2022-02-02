import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor() { }

  isActiveUser() {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

}