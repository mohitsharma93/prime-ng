import { Inject, Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  public get(itemName: string): any {
    const item = localStorage.getItem(itemName);
    const jsonPattern = new RegExp(/[\[\{].*[\}\]]/);

    if (item) {
      if (jsonPattern.test(item)) {
        return JSON.parse(item);
      }
      else {
        return item;
      }
    }
    else {
      return null;
    }

  }

  public set(itemName: string, item: any): void {
    if (typeof item === "object") {
      localStorage.setItem(itemName, JSON.stringify(item));
    } else {
      localStorage.setItem(itemName, item);
    }
  }

  public remove(itemName: string): void {
    localStorage.removeItem(itemName);
  }

  public clearStorage(): void {
    localStorage.clear();
  }
}
