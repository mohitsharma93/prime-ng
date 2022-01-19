import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ActiveUserService {
  constructor() { }

  setToken(token: string, tokenType: string | "bearer"): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    const token: any = localStorage.getItem("token");
    return token;
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
  }

}
